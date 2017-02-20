const fs = require('fs-extra');
const path = require('path');
const loaderUtils = require('loader-utils');

module.exports = function (content) {
    const fileParts = path.parse(this.resource);
    const ext = ['.ts', '.tsx'].indexOf(fileParts.ext) >= 0 ? '.js' : fileParts.ext;
    const srcPath = process.cwd().replace(/\\/gi, '/') + '/src';
    const contextPath = this.context.replace(/\\/gi, '/');

    if (contextPath.indexOf(srcPath) === 0) {
        const outputPath = process.cwd() + contextPath.replace(srcPath, '/dist/lib');

        this.cacheable && this.cacheable();

        fs.ensureDir(outputPath, errEnsureDir => {
            if (errEnsureDir) {
                throw new Error('Ts Lib Loader: outputPath does not exist', 30, 'ts-lib-loader.js');
            }

            fs.writeFile(path.join(outputPath, fileParts.name + ext), content, err => {
                if (err) {
                    throw err;
                }
            });
        });
    }

    return content;
}
