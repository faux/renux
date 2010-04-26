from ImageIndex import get_image_size, fix_newline

def start(img_index):
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
