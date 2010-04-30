from renux import ImageIndex, test_server
from renux import JSIndex, JSCompiler

if __name__ == '__main__':
    #ii = ImageIndex.new()
    #ii.addpath(".")
    #test_server.start(ii)
    jsi = JSIndex()
    jsi.addpath("threejs/three.js")
    jsi.addpath("threejs/stats.js")
    jsi.addpath("threejs/page.js")
    jscc = JSCompiler(jsi)
    jscc.compile('yui', "three_compiled")