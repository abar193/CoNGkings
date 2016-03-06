/**
 * Created by Abar on 04-Dec-15.
 * Configuration for Grunt runner. Makes tilesets from a sets of images, generates .json or .css mapping files.
 *
 * Some tilesets require both .css and .json files - I haven't found a better solution but to specify two sprite
 * commands to first generate image and .css mapping file, then overwrite image with second generation and create .json
 * file for it in another directory.
 */
var myforeach = function(arr, options) { // Allows #foreach command in myjson.handlebars template
    if(options.inverse && !arr.length)
        return options.inverse(this);

    return arr.map(function(item, index) {
        item.$index = index;
        item.$last  = index === arr.length-1;
        return options.fn(item);
    }).join('');
};

module.exports = function(grunt) {
    grunt.initConfig({
        sprite: {
            buildings: {
                src: ['site/src/res/buildings/*.png', 'site/src/res/buildings/*.gif'],
                dest: 'site/dest/public/img/tilesets/buildings.png',
                destCss: 'tmp/buildings.css',
                imgPath: '/img/tilesets/buildings.png',
                cssTemplate: 'site/src/templates/mycss.handlebars',
                cssHandlebarsHelpers: {header: function() {return "building"}}
            },
            widgets: {
                src: ['site/src/res/widgets/*.png', 'site/src/res/widgets/*.gif'],
                dest: 'site/dest/public/img/tilesets/widgets.png',
                destCss: 'tmp/widgets.css',
                imgPath: '/img/tilesets/widgets.png',
                cssTemplate: 'site/src/templates/mycss.handlebars',
                cssHandlebarsHelpers: {header: function() {return "widgets"}}
            },
            bigstarsCss: {
                src: ['site/src/res/bigstars/*'],
                dest: 'site/dest/public/img/tilesets/bigstars.png',
                destCss: 'tmp/bigstars.css',
                imgPath: '/img/tilesets/bigstars.png',
                cssTemplate: 'site/src/templates/mycss.handlebars',
                cssHandlebarsHelpers: {header: function() {return "bigstars"}}
            },
            planetsCss: {
                src: ['site/src/res/planets/*'],
                dest: 'site/dest/public/img/tilesets/planets.png',
                destCss: 'tmp/planets.css',
                imgPath: '/img/tilesets/planets.png',
                cssTemplate: 'site/src/templates/mycss.handlebars',
                cssHandlebarsHelpers: {header: function() {return "planets"}}
            },
            planets: {
                src: ['site/src/res/planets/*'],
                dest: 'site/dest/public/img/tilesets/bigstars.png',
                imgPath: '/img/tilesets/planets.png',
                destCss: 'tmp/planets.json',
                cssTemplate: 'site/src/templates/myjson.handlebars',
                cssHandlebarsHelpers: {foreach: myforeach}
            },
            bigstars: {
                src: ['site/src/res/bigstars/*'],
                dest: 'site/dest/public/img/tilesets/bigstars.png',
                imgPath: '/img/tilesets/bigstars.png',
                destCss: 'tmp/bigstars.json',
                cssTemplate: 'site/src/templates/myjson.handlebars',
                cssHandlebarsHelpers: {foreach: myforeach}
            },
            smallstars: {
                src: ['site/src/res/smallstars/*'],
                dest: 'site/dest/public/img/tilesets/smallstars.png',
                imgPath: '/img/tilesets/smallstars.png',
                destCss: 'tmp/smallstars.json',
                cssTemplate: 'site/src/templates/myjson.handlebars',
                cssHandlebarsHelpers: {foreach: myforeach}
            },
            fog: {
                src: ['site/src/res/fog/*.png'],
                dest: 'site/dest/public/img/tilesets/fog.png',
                destCss: 'tmp/fog.json',
                cssTemplate: 'site/src/templates/myjson.handlebars',
                cssHandlebarsHelpers: {foreach: myforeach},
                imgPath: '/img/tilesets/fog.png'
            }
        },
        "concat-json": {
            "all": {
                src: ["tmp/*.json"],
                dest: "site/dest/public/js/tilesets/combined.json"
            }
        },
        cssmin: {
            target: {
                files: [{
                    src: "tmp/*.css",
                    dest: 'site/dest/public/css/tilesets/tiles.min.css',
                    ext: '.min.css'
                }]
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'site/src/',
                        src: ['js/*', 'css/*', 'data/*', 'img/**', 'partials/*', 'index.html', 'favicon.ico'],
                        dest: 'site/dest/public/',
                        flatten: false,
                        filter: 'isFile'
                    }
                ]
            }
        },
        sync: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'site/src/',
                        src: ['js/*', 'css/*', 'data/*', 'img/**', 'partials/*', 'index.html', 'favicon.ico'],
                        dest: 'site/dest/public/',
                        flatten: false,
                        filter: 'isFile',
                        verbose: true
                    }
                ]
            }
        },
        replace: {
            dev: {
                options: {
                    patterns: [
                        {
                            match: /%BACKEND_URL%/g,
                            replacement: 'http://localhost:6066/api/'
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: false, cwd: 'site/src/', src: ['js/services.js'], dest: 'site/dest/public/'}
                ]
            },
            prod: {
                options: {
                    patterns: [
                        {
                            match: /%BACKEND_URL%/g,
                            replacement: 'http://conkings.com/game2/'
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: false, cwd: 'site/src/', src: ['js/services.js'], dest: 'site/dest/public/'}
                ]
            }
        },
        watch: {
            scripts: {
                files: ['site/src/js/*', 'site/src/css/*', 'site/src/partials/*'],
                tasks: ['sync', 'replace:dev'],
                options: {
                    spawn: false
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-concat-json');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-replace');

    grunt.registerTask('default', ['sprite', 'concat-json', 'cssmin', 'copy', 'replace:prod']);
    grunt.registerTask('dev', ['sprite', 'concat-json', 'cssmin', 'sync', 'replace:dev', 'watch']);
};