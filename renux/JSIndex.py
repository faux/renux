import os
import os.path
import re
import copy

re_os_sep = re.compile(r"[/\\]+")

class JSIndex(object):
    
    formats = [
        ('.js', "application/javascript"),
    ]
    
    def __init__(self):
        self.index = []
    
    def addpath(self, path):
        if os.path.isfile(path):
            self.addfile(path)
        elif os.path.isdir(path):
            for path, dirs, files in os.walk(path):
                for file in files:
                    for ext, mime in self.formats:
                        if file.endswith(ext):
                            file_path = path+os.sep+file
                            self.addfile(file_path)
        else:
            print "error: cannot add path:", path
                        
    def addfile(self, file_path):
        file_path = os.path.join(*re_os_sep.split(file_path))
        if os.path.exists(file_path) and os.path.isfile(file_path):
            if file_path not in self.index:
                print "adding:", file_path
                self.index.append(file_path)
            else:
                print "not adding:", file_path
        else:
            print "cannot add:", file_path
                        
    def combine(self):
        combined = []
        for file in self.index:
            f = open(file)
            combined.append("// from:" + file + "\n")
            combined.append(f.read())
            f.close()
        return "".join(combined)

class JSCompiler(object):
    compilers = {
        'yui': {
            'jar_file': 'yuicompressor.jar',
            'js_input_param': '',
            'js_output_param': '-o',
            'optional_params': '--charset utf-8 -v'
        },
        'closure': {
            'jar_file': 'compiler.jar',
            'js_input_param': '--js',
            'js_output_param': '--js_output_file',
            'optional_params': '--compilation_level ADVANCED_OPTIMIZATIONS',
    #WHITESPACE_ONLY
    #SIMPLE_OPTIMIZATIONS
    #ADVANCED_OPTIMIZATIONS
        },
    }
    
    def __init__(self, js_index):
        self.js_index = js_index
        
    def compile(self, compiler, out_filename):
        compiler = copy.deepcopy(self.compilers[compiler])
        out_temp = out_filename + ".tmp.js"
        
        compiler['input_file'] = out_temp
        compiler['output_file'] = out_filename + ".js"
        
        f = open(out_temp, 'wb')
        f.write(self.js_index.combine())
        f.close()

        command = " ".join([
            "java -jar %(jar_file)s",
            "%(js_input_param)s %(input_file)s",
            "%(js_output_param)s %(output_file)s",
            "%(optional_params)s",
        ]) % compiler

        print "running:", command
        os.system(command);
 
    