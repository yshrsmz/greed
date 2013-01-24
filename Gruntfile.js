module.exports = function(grunt) {
    var proc = require("child_process");
    
    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
        coffee: {
            //concat: {
            //    files: {
            //        'js/greed.min.js': ['src/greed.coffee', 'src/**/*.coffee']
            //        }
            //}
            //,multi: {
            //    files: grunt.file.expandMapping(['src/**/*.coffee'], 'js/', {
            //        rename: function(destBase, destPath) {
            //            grunt.log.writeln(destBase + ' ' + destPath);
            //            return destBase + destPath.replace(/\.coffee$/, '.js');
            //        }
            //    })
            //}
            each: {
                files: {
                    'src/js/*.js': ['src/coffee/**/*.coffee']
                }
            }
        },
        coffee_multi: {
            concat: {
                files: ['src/coffee/greed.coffee', 'src/coffee/deferred.coffee', 'src/coffee/ajax.coffee'],
                dest: 'src/js_concat/greed.min.js'
            },
            each: {
                dir: 'src/coffee/',
                dest: 'src/js/'
            }
        },
        watch: {
            
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-exec');
    
    
    grunt.registerTask('default', ['coffee']);
    
    
    grunt.loadTasks('tasks');
    
    grunt.registerTask('starbucks', function() {
        var done = this.async,
            changedFile = grunt.file.watchFiles.changed[0] || grunt.file.watchFiles.added[0],
            fromTo = grunt.config('starbucks').fromTo;
            
            Object.keys(fromTo).forEach(function(path) {
                if (changedFile.indexOf(path) === 0) {
                    
                }
            });
    });
    
};