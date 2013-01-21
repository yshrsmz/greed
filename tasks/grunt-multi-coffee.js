/**
 * coffee compiling tasks
 * CoffeeScript: http://coffeescript.org/
 * refs: http://takazudo.github.com/blog/entry/2012-04-14-grunt-coffee.html
 */
module.exports = function(grunt) {
    var log = grunt.log;
    
    var handleResult = function (from, dest, err, stdout, code, done) {
        if (err) {
            //grunt.helper('growl', 'COFFEE COMPILING GOT ERROR', stdout);
            log.writeln(from + ': failed to compile to ' + dest + '.');
            log.writeln(stdout);
            done(false);
        } else {
            log.writeln(from + ': compiled to ' + dest + '.');
            done(true);
        }
    }
    
    grunt.registerHelper('coffee_dir_to_dir', function(fromdir, dest, done) {
       var args = {
           cmd: 'coffee',
           args: ['--compile', '--output', dest, fromdir]
       };
       
       grunt.helper('exec', args, function(err, stdout, code) {
           handleResult(fromdir, dest, err, stdout, code, done);
       });
    });
    
    grunt.registerHelper('coffee_multi_to_one', function(srcs, dest, done) {
        srcs = srcs.join(' ');
        
        var args = {
            cmd: 'coffee',
            args: ['--join', dest, '--compile', srcs]
        };
        
        grunt.helper('exec', args, function(err, stdout, code) {
            handleResult(srcs, dest, err, stdout, code, done);
        });
    });
    
    grunt.registerMultiTask('coffee_multi', 'compile coffeeScripts', function() {
        
        var done = this.async();
        var files = this.data.files;
        var dir = this.data.dir;
        var dest = this.data.dest;
        
        if (dir) {
            // if destination was not defined, compile to same dir
            if (!dest) {
                dest = dir;
            }
            grunt.helper('coffee_dir_to_dir', dir, dest, done);
            return;
        }
        
        // ex: ['1.coffee', '2.coffee'] -> foo.js
        if (files) {
            grunt.helper('coffee_multi_to_one', files, dest, done);
            return;
        }
        
    });
}
