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
            //each: {
            //    files: {
            //        'src/js/*.js': ['src/coffee/**/*.coffee']
            //    }
            //}
        },
        coffee_multi: {
            concat: {
                files: ['src/coffee/greed.coffee', 'src/coffee/deferred.coffee', 'src/coffee/ajax.coffee'],
                dest: 'src/js_concat/greed.min.js'
            },
            each: {
                dir: 'src/coffee/',
                dest: 'src/js/'
            },
            test: {
                dir: 'test/spec/coffee/',
                dest: 'test/spec/js/'
            }
        },
        jasmine: {
            part: {
                src: ['src/js/**.js'],
                errorReporting: true,
                server: {
                    port: process.env.PORT
                },
                phantomjs: {
                    'ignore-ssl-errors': true
                },
                options: {
                    specs: ['test/spec/js/*Spec.js']
                }
            },
            all: {
                src:['src/js_concat/greed.min.js'],
                errorReporting: true,
                server: {
                    port: process.env.PORT
                },
                phantomjs: {
                    'ignore-ssl-errors': true
                },
                options: {
                    helpers: ['test/lib/jasmine-dom-fixtures.js', 'test/lib/jasmine-dom-matchers.js'],
                    specs: ['test/spec/js/*Spec.js']
                }
            }
        },
        watch: {
            jasmine: {
                files: ['test/spec/js/*Spec.js', 'src/js_concat/*.js'],
                tasks: ['jasmine:all']
            },
            coffee_each: {
                files: ['src/coffee/**/*.coffee'],
                tasks: ['coffee_multi:each', 'coffee_multi:concat']
            },
//            coffee_concat: {
//                files: ['src/coffee/**/*.coffee'],
//                tasks: ['coffee_multi:concat']
//            },
            coffee_test: {
                files: ['test/spec/coffee/**/*.coffee'],
                tasks: ['coffee_multi:test']
            }
            
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-exec');
    //grunt.loadNpmTasks('grunt-buster');
    
    
    grunt.registerTask('default', ['coffee_multi']);
    
    
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