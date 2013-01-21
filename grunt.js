/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js', 'js/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    coffee: {
        /**
        app: {
            src: [
                'src/greed.coffee',
                'src/ajax.coffee'
            ],
            dest: 'js/greed.js'
        }
        */
        each: {
            files: {
                'js/*.js': ['src/**/*.coffee']
            }
        }
    },
    coffee_multi: {
        dist1: {
            files: ['src/greed.coffee', 'src/promise.coffee', 'src/ajax.coffee'],
            dest: 'js/greed.min.js'
        }
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:lib/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    watch: {
        coffee: {
            files: ['src/**/*.coffee'],
            tasks: 'coffee_multi coffee lint'
        }
      //files: '<config:lint.files>',
      //tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        devel: true
      },
      globals: {
        jQuery: true,
        Greed: true
      }
    },
    uglify: {}
  });

    grunt.loadNpmTasks('grunt-contrib');
    
    grunt.loadTasks('tasks');
    
  // Default task.
  grunt.registerTask('default', 'lint qunit concat min');

};
