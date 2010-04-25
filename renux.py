import renux

if __name__ == '__main__':
    ii = renux.ImageIndex()
    ii.addpath(".")
    print ii.encode("http://test.com/test.css")
