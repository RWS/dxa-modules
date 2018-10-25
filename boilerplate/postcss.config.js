module.exports = {
    plugins: [
        require('autoprefixer')({
            // See https://github.com/postcss/autoprefixer
            browsers: ['Last 2 versions', 'IE 9-11']
        })
    ]
}
