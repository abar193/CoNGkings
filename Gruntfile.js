/**
 * Created by Abar on 04-Dec-15.
 * Configuration for Grunt runner. Makes tilesets from a sets of images
 */
var myforeach = function(arr, options) {
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
                src: ['src/buildings/*.png', 'src/buildings/*.gif'],
                dest: 'public/images/tilesets/buildings.png',
                destCss: 'src/tmpcss/buildings.css',
                imgPath: '/images/tilesets/buildings.png',
                cssTemplate: 'src/templates/mycss.handlebars',
                cssHandlebarsHelpers: {header: function() {return "building"}}
            },
            widgets: {
                src: ['src/widgets/*.png', 'src/widgets/*.gif'],
                dest: 'public/images/tilesets/widgets.png',
                destCss: 'src/tmpcss/widgets.css',
                imgPath: '/images/tilesets/widgets.png',
                cssTemplate: 'src/templates/mycss.handlebars',
                cssHandlebarsHelpers: {header: function() {return "widgets"}}
            },
            bigstarsCss: {
                src: ['src/bigstars/*'],
                dest: 'public/images/tilesets/bigstars.png', // yes, that overwrites file from bigstars step
                destCss: 'src/tmpcss/bigstars.css',
                imgPath: '/images/tilesets/bigstars.png',
                cssTemplate: 'src/templates/mycss.handlebars',
                cssHandlebarsHelpers: {header: function() {return "bigstars"}}
            },
            bigstars: {
                src: ['src/bigstars/*'],
                dest: 'public/images/tilesets/bigstars.png',
                imgPath: '/images/tilesets/bigstars.png',
                destCss: 'src/tmp/bigstars.json',
                cssTemplate: 'src/templates/myjson.handlebars',
                cssHandlebarsHelpers: {foreach: myforeach}
            },
            smallstars: {
                src: ['src/smallstars/*'],
                dest: 'public/images/tilesets/smallstars.png',
                imgPath: '/images/tilesets/smallstars.png',
                destCss: 'src/tmp/smallstars.json',
                cssTemplate: 'src/templates/myjson.handlebars',
                cssHandlebarsHelpers: {foreach: myforeach}
            },
            fog: {
                src: ['src/fog/*.png'],
                dest: 'public/images/tilesets/fog.png',
                destCss: 'src/tmp/fog.json',
                cssTemplate: 'src/templates/myjson.handlebars',
                cssHandlebarsHelpers: {foreach: myforeach},
                imgPath: '/images/tilesets/fog.png'
            }
        },
        "concat-json": {
            "all": {
                src: ["src/tmp/*.json"],
                dest: "public/js/tilesets/combined.json"
            }
        },
        cssmin: {
            target: {
                files: [{
                    src: "src/tmpcss/*.css",
                    dest: 'public/stylesheets/tilesets/tiles.min.css',
                    ext: '.min.css'
                }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-concat-json');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['sprite', 'concat-json', 'cssmin']);
};