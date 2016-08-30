'use strict';

const through = require('through2');
const css = require('css');

/**
 * Gulp plugin to wrap styles of a css into single class
 * This to make sure that the styles don't affect styles outside of the scope of it's element
 * @module wrap-css
 */
module.exports = options => {
    return through.obj((file, enc, cb) => {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (!options.className) {
            cb(new Error('className option should be specified'));
            return;
        }

        const contents = file.contents.toString();
        const parsedCss = css.parse(contents);

        // Add class to all selectors
        for (let rule of parsedCss.stylesheet.rules) {
            if (Array.isArray(rule.selectors)) {
                let index = 0;
                for (let selector of rule.selectors) {
                    rule.selectors[index] = `.${options.className} ${selector}`;
                    index++;
                }
            }
        }

        const updatedCss = css.stringify(parsedCss);

        file.contents = new Buffer(updatedCss);

        cb(null, file);
    });
};
