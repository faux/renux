import os
import base64
import re

try:
    from javax.imageio import ImageIO
    from java.io import File
except:
    from PIL import Image as PILImage

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
            
            try:
                img = ImageIO.read(File(self['path']))
                width = img.getWidth()
                height = img.getHeight()
            except NameError:
                img = PILImage.open(self['path'])
                width, height = img.size
                
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
        
    def getimages(self):
        return self.images
    
    def encode(self, url_path):
        for image in self.images:
            image.encode()
        return (encoded_doc_template % {
                                     'mhtml_items': '\n'.join(image.mhtml() for image in self.images),
                                     'css_items': '\n'.join(image.css() for image in self.images),
                                     }) % {'url_path': url_path,}
