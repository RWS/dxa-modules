'use strict';

const gulp = require('gulp');
const gulpDebug = require('gulp-debug');
const browserSync = require('browser-sync').create();
const fs = require('fs-extra');
const async = require('async');
const runSequence = require('run-sequence');
const packageInfo = require('./package.json');
const gulpTypings = require('./build/gulp-plugins/install-typings');
const yargs = require('yargs');
const path = require('path');

const sourcesPath = './src/';
const buildOptions = {
    version: packageInfo.version,
    sourcesPath: sourcesPath,
    distPath: './dist/',
    isDebug: true,
    isDefaultTask: false
};
let webpackInstance = {
    compiler: null,
    config: null,
    onBundleCreated: null
};

// Log info
console.log(`Application version: ${buildOptions.version}`);

// Tasks
const runTSLint = require('./build/gulp-tasks/run-tslint')(buildOptions, gulp);
const serve = require('./build/gulp-tasks/serve')(buildOptions, gulp, browserSync);

gulp.task('copy-dependencies', cb => {
    if (buildOptions.isDebug) {
        // In case of debug mappings for browsersync are being used
        cb();
        return;
    }
    async.parallel([
        // React
        next => {
            gulp.src('./node_modules/react/dist/*')
                .pipe(gulpDebug({
                    title: 'Copying'
                }))
                .pipe(gulp.dest(`${buildOptions.distPath}lib/react/`))
                .on('end', next);
        },
        // React dom
        next => {
            gulp.src('./node_modules/react-dom/dist/*')
                .pipe(gulpDebug({
                    title: 'Copying'
                }))
                .pipe(gulp.dest(`${buildOptions.distPath}lib/react-dom/`))
                .on('end', next);
        }
    ], cb);
});

gulp.task('package-project', [
    'copy-dependencies',
    'install-typings'
], cb => {
    const onCompleted = (err, wpInstance) => {
        webpackInstance = wpInstance;
        cb(err);
    };
    require('./build/gulp-tasks/package-project')(buildOptions)(onCompleted);
});

gulp.task('run-tslint', runTSLint);

gulp.task('install-typings', function () {
    return gulp.src("./typings.json")
        .pipe(gulpTypings());
});

// Common tasks
gulp.task('build', [
    'copy-dependencies',
    'run-tslint',
    'package-project'
]);

gulp.task('build:dist', cb => {
    buildOptions.isDebug = false;
    runSequence('clean', 'build', errRs => {
        const targetPath = yargs.argv.targetPath;
        if (errRs || !targetPath) {
            cb(errRs);
            return;
        }
        console.log(`Removing previous output from ${targetPath}`);
        fs.remove(targetPath, errRemove => {
            if (errRemove) {
                cb(errRemove);
                return;
            }
            fs.ensureDir(targetPath, errEnsure => {
                if (errEnsure) {
                    cb(errEnsure);
                    return;
                }
                const assetsDistPath = buildOptions.distPath + 'assets/';
                const assetsTargetPath = path.normalize(targetPath + '/assets/');
                console.log(`Moving files from ${assetsDistPath} to ${assetsTargetPath}`);
                // Only move assets, other files are not needed
                fs.move(assetsDistPath, assetsTargetPath, {
                    clobber: true
                }, cb);
            });
        });
    });
});

gulp.task('clean', function (cb) {
    async.parallel([
        function (next) {
            // Clean typings folder
            fs.remove('./typings', next);
        },
        function (next) {
            // Clean dist folder
            fs.remove(buildOptions.distPath, next);
        }
    ], cb);
});

gulp.task('default', function (cb) {
    buildOptions.isDefaultTask = true;
    buildOptions.isDebug = false;
    runSequence('clean', 'build', cb);
});

gulp.task('serve', ['build'], cb => {
    serve(cb, webpackInstance);
});

gulp.task('serve:dist', function (cb) {
    // Build release
    buildOptions.isDebug = false;

    runSequence(
        'build',
        function (err) {
            if (err) {
                cb(err);
                return;
            }
            serve(cb, webpackInstance);
        });
});

// Error handling
gulp.on('task_err', function (err) {
    console.error('Task failed:', err);
    // This error event is fired on the entire task tree
    // If it fails on a sub task this event will also be fired for all parent tasks
    // It should only be handled on the main task
    if (err.task === 'default') {
        process.exit(1);
    }
});

gulp.on('task_stop', e => {
    // Sometimes the default task does not exit the process
    if (e.task === 'default') {
        setTimeout(() => process.exit(0), 0);
    }
});

process.on('uncaughtException', err => {
    const date = (new Date).toUTCString();
    console.error(date + ' uncaughtException:', err.message);
    console.error(err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
    const date = (new Date).toUTCString();
    console.error(date + ' Unhandled Rejection at: Promise ', p, ' reason: ', reason);
    process.exit(1);
});
