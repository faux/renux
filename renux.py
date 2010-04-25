import renux

if __name__ == '__main__':
    ii = renux.ImageIndex()
    ii.addpath(".")
    renux.test_server(ii)
