'use strict';

var path = require('path');
var through2 = require('through2');
var typingsCore = require('typings-core');

var forEach = function (file, enc, cb) {
    typingsCore.install({ production: false, cwd: path.dirname(file.path) })
        .then(function () {
            cb(null, file);
        }, cb);
};

var atEnd = function (cb) {
    cb();
};

module.exports = function (optionsArg) {
    return through2.obj(forEach, atEnd);
};
