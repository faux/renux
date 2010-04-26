from renux import ImageIndex, test_server

if __name__ == '__main__':
    ii = ImageIndex.new()
    ii.addpath(".")
    test_server.start(ii)
