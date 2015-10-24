var express = require('express');
var router = express.Router();

router.get("/", function(req, res, next) {
   res.render("index");
});

router.put('/', function(req, res, next) {
    res.render('index', { title: 'Put Express' });
});

router.delete('/', function(req, res, next) {
    res.render('index', { title: 'Delete Express' });
});

module.exports = router;
