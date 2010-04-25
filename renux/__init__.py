import os
import base64
import re

re_url_safe = re.compile("[^A-Za-z0-9_]")
separator = "_ANY_STRING_WILL_DO_AS_A_SEPARATOR"
encoded_doc_template = """/*
Content-Type: multipart/related; boundary="%s"

%%(mhtml_items)s
*/

%%(css_items)s
""" % separator
mhtml_item_template = """--%s
Content-Location:%%(safe_name)s
Content-Transfer-Encoding:base64

%%(b64)s
""" % separator

css_item_template = """
.%(safe_name)s {
background: url(data:%(mime)s;base64,%(b64)s);
*background: url(mhtml:%%(url_path)s!%(safe_name)s);
height: %(height)s;
width: %(width)s;
}
"""


def get_image_size(path):
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
        
    return width, height


class Image(dict):
    def __init__(self, **kwargs):
        super(Image, self).__init__(**kwargs)
        self['safe_name'] = re_url_safe.sub("_", self['filename'])
        self.encoded = False
        
            
    def encode(self):
        if not self.encoded:
            img = open(self['path'], "rb")
            self['b64'] = base64.b64encode(img.read())
            img.close()
            
            width, height = get_image_size(self['path'])
                
            self['width'] = width
            self['height'] = height
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
        
    def encode(self, url_path):
        for image in self.images:
            image.encode()
        return (encoded_doc_template % {
                                     'mhtml_items': '\n'.join(image.mhtml() for image in self.images),
                                     'css_items': '\n'.join(image.css() for image in self.images),
                                     }) % {'url_path': url_path,}

def test_server(img_index):
    import BaseHTTPServer
    server_class=BaseHTTPServer.HTTPServer
    encoded_imgs = img_index.encode("/images.css")
    class renux_server(BaseHTTPServer.BaseHTTPRequestHandler):
        def do_GET(self):
            if self.path == "/images.css":
                self.send_response(200)
                self.send_header("Content-type", "text/css")
                self.send_header("Content-Length", len(encoded_imgs))
                self.end_headers()
                self.wfile.write(encoded_imgs)
            elif self.path == "/":
                html_images = []
                for img in img_index.images:
                    html_images.append("""
                    <h1>%(filename)s</h1>
                    <div class="%(safe_name)s"></div>
                    """ % img)
                html_page = """
                <html>
                    <head><link rel="stylesheet" href="/images.css" type="text/css"/></head>
                    <body>%s</body>
                </html>""" % "\n".join(html_images)
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.send_header("Content-Length", len(html_page))
                self.end_headers()
                self.wfile.write(html_page)
            else:
                self.send_response(404)
                self.end_headers()
    handler_class=renux_server
    server_address = ('', 8000)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()