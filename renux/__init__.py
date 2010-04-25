import os
import base64
import re


re_url_safe = re.compile("[^A-Za-z0-9_]")
separator = "_ANY_STRING_WILL_DO_AS_A_SEPARATOR"
mhtml_doc_template = """/*
Content-Type: multipart/related; boundary="%s"

%%(mhtml_items)s
*/
""" % separator
mhtml_item_template = """--%s
Content-Location:%%(safe_name)s
Content-Transfer-Encoding:base64

%%(b64)s
""" % separator

class Image(dict):
    def __init__(self, **kwargs):
        super(Image, self).__init__(**kwargs)
        self['safe_name'] = re_url_safe.sub("_", self['filename'])
        
            
    def encode(self):
        if not self.encoded:
            img = open(self['path'], "rb")
            self['b64'] = base64.b64encode(img.read())
            img.close()
            self.encoded = True
        
    def mhtml(self):
        return mhtml_item_template % self

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
    
    def encode(self, format_name=None):
        for image in self.images:
            image.encode()
            
    def mhtml(self):
        self.encode()
        return mhtml_doc_template % {'mhtml_items': '\n'.join(image.mhtml() for image in self.images)}    
    
            
            
            
            