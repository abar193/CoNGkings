ConKings UI 
-----------

Is a fan-made frontend project for online game [Kings of Constellations](http://conkings.com). 
It is an attempt to make from the existing (5+ years old) interface something cool and modern.  

Technologies used
-----------------

* Node.js
* Angular.js
* Bower
* Grunt.js

How to start
------------

Typically you would need to fork/download the repo and run 

    npm install 
    npm start
 
Projet separates source files and the compiled tile sets and minimized libraries. To update project for production run
 
    grunt
    
This is used by default while installing project from npm. It configures frontend controllers to access the 
original production [backend](http://conkings.com/game2/). 
 
 If you wish to contribute to project and develop something, run 
 
    grunt dev
    
 This will configure frontend to access localhost, and starts grunt-watch plugin to recompile project files on changes.
 
 Project structure
------------------

* bin/www  - Run "node www" to start project manually 
* routes/ - Contains node.js files for production-server emulating frontend
* site/src/ - Contains development files like index.html, stylesheets, javascript libraries, and tilesets sources
If you are editing those files without running "grunt dev" prior, then you will have to run "grunt" each time you make a change, to 
recompile frontend files
* site/dest/ - This directory contains compiled files and tiles sets, you may ignore it and let grunt do it's work
* bower_components - If you wish to use this project without node, make this directory contents available for users
    
Contacts
--------

The project's thread on the official forum may be found [there](http://conkings.com/comm/ucp.php?i=pforums&mode=access&f=39&join=1)
(You have to be registered in the game!) Feel free to point out my mistakes, and submit your own improvements!