'use strict';

var through = require('through2');
var xmlDom = require('xmldom');
var domParser = new xmlDom.DOMParser();
var xmlSerializer = new xmlDom.XMLSerializer();

/**
 * Gulp plugin to update version inside a configuration.xml file
 * @module update-configuration-version
 * @param {Object} options Specifies the version of the application and the version of the CUIL.
 */
module.exports = options => {
    let {version, cuilVersion} = options;
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        var contents = file.contents.toString();

        // Get version from configuration.xml and update it
        var doc = domParser.parseFromString(contents, 'text/xml');
        var settingsElements = doc.getElementsByTagName('setting');
        for (var i = 0, length = settingsElements.length; i < length; i++) {
            var el = settingsElements[i];
            if (el.getAttribute('name') === 'version') {
                el.setAttribute('value', version);
            }
            if (el.getAttribute('name') === 'coreVersion') {
                el.setAttribute('value', cuilVersion);
            }
        }

        file.contents = new Buffer(xmlSerializer.serializeToString(doc));

        cb(null, file);
    });
};
