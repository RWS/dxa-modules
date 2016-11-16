const path = require('path');

module.exports = {
    plugins: [
        require('autoprefixer')({
            // See https://github.com/postcss/autoprefixer

            // browsers (array): list of browsers, which are supported in your project. You can directly specify browser version (like IE 7) or use selections (like last 2 version or > 5%).

            // cascade (boolean): should Autoprefixer use Visual Cascade, if CSS is uncompressed.
            // Default: true

            // add (boolean): should Autoprefixer add prefixes.
            // Default is true.

            // remove (boolean): should Autoprefixer [remove outdated] prefixes.
            // Default is true.

            // supports (boolean): should Autoprefixer add prefixes for @supports parameters.
            // Default is true.

            // flexbox (boolean|string): should Autoprefixer add prefixes for flexbox properties. With "no-2009" value Autoprefixer will add prefixes only for final and IE versions of specification.
            // Default is true.

            // grid (boolean): should Autoprefixer add IE prefixes for Grid Layout properties.
            // Default is true.

            // stats (object): custom usage statistics for > 10% in my stats browsers query.
        })
    ]
}
