'use strict';

const gulp = require('gulp');
const gulpDebug = require('gulp-debug');
const browserSync = require('browser-sync').create();
const fs = require('fs-extra');
const _ = require('lodash');
const async = require('async');
const runSequence = require('run-sequence');
const packageInfo = require('./package.json');
const catalinaPackageInfo = require('./node_modules/sdl-catalina/package.json');
const gulpTypings = require('./build/gulp-plugins/install-typings');
const yargs = require('yargs');

const reload = browserSync.reload;
const sourcesPath = './src/';
const buildOptions = {
    version: packageInfo.version,
    catalinaVersion: catalinaPackageInfo.version,
    sourcesPath: sourcesPath,
    testPath: './test/',
    distPath: './dist/',
    isDebug: true,
    isDefaultTask: false,
    isTest: false,
    coverage: {
        minCoverage: { // Minimum code coverage %
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80
        }
    },
    ports: {
        httpServer: 9005
    },
    excludePatterns: {
        global: [
            '!' + sourcesPath + '**/{node_modules,node_modules/**}',
            '!' + sourcesPath + '**/**/[.]git*', // .gitignore, .gitattributes..
            '!' + sourcesPath + '**/tsconfig.json',
            // IntelliJ IDEA
            '!' + sourcesPath + '**/{[.]idea,[.]idea/**}',
            // Visual studio
            '!' + sourcesPath + '**/{[.]vs,[.]vs/**}',
            '!' + sourcesPath + '**/*.sln',
            '!' + sourcesPath + '**/*.suo',
            '!' + sourcesPath + '**/*.csproj*',
            '!' + sourcesPath + '**/*.vssscc',
            '!' + sourcesPath + '**/*.bat',
            '!' + sourcesPath + '**/web.*.config',
            '!' + sourcesPath + '**/*.targets',
            '!' + sourcesPath + '**/packages.config',
            '!' + sourcesPath + '**/{obj,obj/**}',
            '!' + sourcesPath + '**/{bin,bin/**}'
        ]
    }
};

// Log info
console.log(`Application version: ${buildOptions.version}, Catalina version: ${buildOptions.catalinaVersion}`);

const commonFolderName = function () {
    return buildOptions.isDebug ? 'Common.debug' : 'Common';
};

// Tasks
const runTSLint = require('./build/gulp-tasks/run-tslint')(buildOptions, gulp);
const serve = require('./build/gulp-tasks/serve')(buildOptions, gulp, browserSync, commonFolderName);
const runKarma = require('./build/gulp-tasks/run-karma')(buildOptions, browserSync);
const runTests = function (singleRun, cb, onTestRunCompleted) {
    return function (err) {
        var onTestCompleted = function (err, results) {
            browserSync.exit();
            cb(err, results);
        };
        if (err) {
            cb(err);
        } else {
            serve(function (err) {
                if (err) {
                    cb(err);
                } else {
                    runKarma(singleRun, onTestCompleted, onTestRunCompleted);
                }
            }, !singleRun);
        }
    };
};
const testCoverage = function (cb, singleRun) {
    singleRun = typeof singleRun === 'boolean' ? singleRun : false;
    return require('./build/gulp-tasks/test-coverage')(buildOptions, gulp, runTests, singleRun)(cb);
};

gulp.task('copy-sources', require('./build/gulp-tasks/copy-sources')(buildOptions, gulp));

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
                .pipe(gulpDebug({ title: 'Copying' }))
                .pipe(gulp.dest(`${buildOptions.distPath}lib/react/`))
                .on('end', next);
        },
        // React dom
        next => {
            gulp.src('./node_modules/react-dom/dist/*')
                .pipe(gulpDebug({ title: 'Copying' }))
                .pipe(gulp.dest(`${buildOptions.distPath}lib/react-dom/`))
                .on('end', next);
        },
        // Catalina
        next => {
            gulp.src(['./node_modules/sdl-catalina/' + commonFolderName() + '/**/*'])
                .pipe(gulpDebug({ title: 'Copying' }))
                .pipe(gulp.dest(`${buildOptions.distPath}SDL/Common`))
                .on('end', next);
        },
        // Catalina React Wrappers
        next => {
            gulp.src(['./node_modules/sdl-catalina-react-wrappers/dist/components/**/*'])
                .pipe(gulpDebug({ title: 'Copying' }))
                .pipe(gulp.dest(`${buildOptions.distPath}SDL/ReactComponents`))
                .on('end', next);
        },
        // Mocks
        next => {
            gulp.src(['./mocks/**/*'])
                .pipe(gulpDebug({ title: 'Copying' }))
                .pipe(gulp.dest(`${buildOptions.distPath}mocks/`))
                .on('end', next);
        }
    ], cb);
});

gulp.task('update-version', ['copy-sources'], require('./build/gulp-tasks/update-version')(buildOptions, gulp));

gulp.task('package-project', [
    'copy-dependencies',
    'install-typings',
    'wrap-dita-ot-styles'
], require('./build/gulp-tasks/package-project')(buildOptions, browserSync));

gulp.task('run-tslint', runTSLint);

gulp.task('test-coverage', testCoverage);

gulp.task('install-typings', function () {
    return gulp.src("./typings.json")
        .pipe(gulpTypings());
});

gulp.task('wrap-dita-ot-styles', require('./build/gulp-tasks/wrap-dita-ot-styles')(buildOptions, gulp));

// Common tasks
gulp.task('build', [
    'copy-dependencies',
    'copy-sources',
    'run-tslint',
    'package-project',
    'update-version'
]);

gulp.task('build:dist', cb => {
    buildOptions.isDebug = false;
    runSequence('clean', 'build', err => {
        if (err || !yargs.argv.targetPath) {
            cb(err);
            return;
        }
        fs.remove(yargs.argv.targetPath, err => {
            if (err) {
                cb(err);
                return;
            }
            fs.move(buildOptions.distPath, yargs.argv.targetPath, cb);
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
        },
        function (next) {
            // Clean test coverage folder
            fs.remove(buildOptions.testPath + 'coverage/', next);
        }
    ], cb);
});

gulp.task('default', function (cb) {
    buildOptions.isDefaultTask = true;

    async.series([
        next => {
            // Debug
            runSequence('clean', function (err) {
                if (err) {
                    next(err);
                } else {
                    testCoverage(next, true);
                }
            });
        },
        next => {
            // Reset build options
            buildOptions.isTest = false;

            // Release
            buildOptions.isDebug = false;
            runSequence('clean', 'test', next);
        }
    ], cb);
});

gulp.task('serve', ['build'], serve);

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
            serve(cb);
        });
});

gulp.task('serve:test', function (cb) {
    buildOptions.isTest = true;
    runSequence('build', runTests(false, cb));
});

gulp.task('test', function (cb) {
    buildOptions.isTest = true;
    // Build release
    buildOptions.isDebug = false;

    runSequence(
        'build',
        runTests(true, cb));
});

// Error handling
gulp.on('task_err', function (err) {
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
