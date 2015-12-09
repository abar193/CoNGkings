/**
 * Created by Abar on 04-Dec-15.
 * Configuration for Grunt runner. Makes tilesets from a sets of images
 */
module.exports = function(grunt) {
    grunt.initConfig({
        sprite: {
            buildings: {
                src: ['src/buildings/*.png', 'src/buildings/*.gif'],
                dest: 'public/images/tilesets/buildings.png',
                destCss: 'public/stylesheets/tilesets/buildings.css',
                imgPath: '/images/tilesets/buildings.png',
                cssTemplate: 'src/templates/mycss.handlebars',
                cssHandlebarsHelpers: {header: function() {return "building"}}
            },
            widgets: {
                src: ['src/widgets/*.png', 'src/widgets/*.gif'],
                dest: 'public/images/tilesets/widgets.png',
                destCss: 'public/stylesheets/tilesets/widgets.css',
                imgPath: '/images/tilesets/widgets.png',
                cssTemplate: 'src/templates/mycss.handlebars',
                cssHandlebarsHelpers: {header: function() {return "widgets"}}
            },
            fog: {
                src: ['src/fog/*.png'],
                dest: 'public/images/tilesets/fog.png',
                destCss: 'public/js/tilesets/fog.json',
                imgPath: '/images/tilesets/fog.png'
            }
        }
    });

    grunt.loadNpmTasks('grunt-spritesmith');
};