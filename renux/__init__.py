import os
import base64
import re

re_url_safe = re.compile("[^A-Za-z0-9_]")
re_drop_ext = re.compile("\.\w+$")
separator = "_ANY_STRING_WILL_DO_AS_A_SEPARATOR"
encoded_doc_template = """/*
Content-Type: multipart/related; boundary="%s"
*/

%%(css_items)s
""" % separator
mhtml_item_template = """--%s
Content-Location:%%(safe_name)s
Content-Transfer-Encoding:base64

%%(b64)s""" % separator

css_item_template = """.%(safe_name)s {/*
%(mhtml)s
*/
background-image: url("data:%(mime)s;base64,%(b64)s");
*background-image: url(mhtml:%%(url_path)s!%(safe_name)s);
%(custom_css)s
}"""

def get_image_size(image):
    path = image['path']
    try:
        from javax.imageio import ImageIO
        from java.io import File
        img = ImageIO.read(File(path))
        width = img.getWidth()
        height = img.getHeight()
    except ImportError:
        from PIL import Image as PILImage
        img = PILImage.open(path)
        width, height = img.size
    
    image['custom_css'] += "height:%(height)spx;width:%(width)spx;" % {'width': width, 'height': height}

def get_safe_name(image):
    return re_url_safe.sub("_", re_drop_ext.sub("", image['filename']))

class Image(dict):
    def __init__(self, **kwargs):
        super(Image, self).__init__(**kwargs)
        self['safe_name'] = get_safe_name(self)
        self['custom_css'] = ''
        self.encoded = False
            
    def encode(self, custom_method=None):
        if not self.encoded:
            img = open(self['path'], "rb")
            self['b64'] = base64.b64encode(img.read())
            img.close()
            
            if custom_method != None:
                custom_method(self)
                
            
            self['mhtml'] = self.mhtml()
            self.encoded = True
        
    def mhtml(self):
        return mhtml_item_template % self
    
    def css(self):
        return css_item_template % self

class ImageIndex(object):
    '''
    '''
    
    # ( ext, mimetype )
    image_formats = [
        ('jpg', 'image/jpg'),
        ('png', 'image/png')
    ]
    
    encode_methods = []
    
    def __init__(self):
        '''
        '''
        self.images = []
        
    def addpath(self, path):
        for filename in os.listdir(path):
            for ext, mime in self.image_formats:
                if filename.endswith(ext):
                    img_path = path + os.sep + filename
                    img = Image(path=img_path, mime=mime, filename=filename)
                    self.images.append(img)

    def add_encode_method(self, method):
        self.encode_methods.append(method)
        
    def encode(self, url_path):
        def __custom_encode(image):
            for m in self.encode_methods:
                m(image)
        
        for image in self.images:
            image.encode(custom_method=__custom_encode)
        return (encoded_doc_template % {
                                     'css_items': '\n'.join(image.css() for image in self.images),
                                     }) % {'url_path': url_path, }

def fix_newline(string):
    import StringIO
    out_string = StringIO.StringIO()
    for i in xrange(len(string)):
        if string[i] == '\n':
            out_string.write('\r\n')
        else:
            out_string.write(string[i])
    return out_string.getvalue()

def save_imageindex(img_index, filename, url_path):
    encoded_imgs = img_index.encode(url_path)
    encoded_imgs = fix_newline(encoded_imgs)
    file = open(filename, "wb")
    file.write(encoded_imgs)
    file.close()

def test_server(img_index):
    import BaseHTTPServer
    import zlib
    import socket
    
    img_index.add_encode_method(get_image_size)
    
    server_ip = socket.gethostbyname(socket.gethostname())
    server_url = "http://" + server_ip + ":8000/"
    server_class = BaseHTTPServer.HTTPServer
    encoded_imgs = img_index.encode(server_url + "images.css")
    encoded_imgs = fix_newline(encoded_imgs)
    uncompressed_size = len(encoded_imgs)
    encoded_imgs = zlib.compress(encoded_imgs)
    
    class renux_server(BaseHTTPServer.BaseHTTPRequestHandler):
        def do_GET(self):
            content_encoding = "deflate" if self.headers['User-Agent'].find("MSIE") == -1 else "gzip"
            
            if self.path == "/images.css":
                self.send_response(200)
                self.send_header("Content-Encoding", content_encoding)
                self.send_header("Content-Type", "text/css")
                self.send_header("Content-Length", len(encoded_imgs))
                self.send_header("Expires", "Fri, 30 Oct 1998 14:19:41 GMT")
                self.send_header("Cache-Control", "max-age=0, must-revalidate")
                self.end_headers()
                self.wfile.write(encoded_imgs)
            elif self.path == "/":
                html_images = []
                for img in img_index.images:
                    html_images.append("""
                    <h1>%(filename)s</h1>
                    <div class="%(safe_name)s"></div>
                    """ % img)
                html_page = """<!DOCTYPE html> 
                <html>
                    <head><link rel="stylesheet" href="/images.css" type="text/css"/></head>
                    <body>%s</body>
                </html>""" % "\n".join(html_images)
                html_page = zlib.compress(html_page)
                self.send_response(200)
                self.send_header("Content-Encoding", content_encoding)
                self.send_header("Content-Type", "text/html")
                self.send_header("Content-Length", len(html_page))
                self.send_header("Expires", "Fri, 30 Oct 1998 14:19:41 GMT")
                self.send_header("Cache-Control", "max-age=0, must-revalidate")
                self.end_headers()
                self.wfile.write(html_page)
            else:
                self.send_response(404)
                self.end_headers()
    handler_class = renux_server
    server_address = (server_ip, 8000)
    httpd = server_class(server_address, handler_class)
    print "serving on:", server_url
    print "uncompressed:", uncompressed_size
    print "  compressed:", len(encoded_imgs)
    httpd.serve_forever()
