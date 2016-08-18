'use strict';

var gulp = require('gulp');
var gulpTypescript = require('gulp-typescript');
var gulpLess = require('gulp-less');
var gulpDebug = require('gulp-debug');
var browserSync = require('browser-sync').create();
var fs = require('fs-extra');
var _ = require('lodash');
var async = require('async');
var runSequence = require('run-sequence');
const packageInfo = require('./package.json');
var gulpTypings = require('./build/gulp-plugins/install-typings');
const yargs = require('yargs');

var reload = browserSync.reload;
var sourcesPath = './src/';
var buildOptions = {
    version: packageInfo.version,
    catalinaVersion: packageInfo.peerDependencies['sdl-catalina'],
    sourcesPath: sourcesPath,
    testPath: './test/',
    distPath: './dist/',
    libraryPath: './{dist/SDL,SDL}/Common/',
    isDebug: true,
    isDefaultTask: false,
    isTestCoverage: false,
    coverage: {
        minCoverage: { // Minimum code coverage %
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80
        },
        filesInstrumented: []
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
console.log('Application version: ' + buildOptions.version);

var commonFolderName = function () {
    return buildOptions.isDebug ? 'Common.debug' : 'Common';
};

// Tasks
var compileLess = require('./build/gulp-tasks/compile-less')(buildOptions, gulp);
var compileTypescript = require('./build/gulp-tasks/compile-typescript')(buildOptions, gulp);
var runTSLint = require('./build/gulp-tasks/run-tslint')(buildOptions, gulp);
var serve = require('./build/gulp-tasks/serve')(buildOptions, gulp, browserSync, commonFolderName);
var copyCatalina = function (cb) {
    // simple task to copy from node_modules/sdl-catalina/Common
    // to src\main\webapp\SDL\Common
    var target = buildOptions.distPath + 'SDL/Common';
    // Clean up
    fs.remove(target, function (err) {
        if (err) {
            cb(err);
        } else {
            // Copy
            gulp.src(['./node_modules/sdl-catalina/' + commonFolderName() + '/**/*'])
                .pipe(gulpDebug({ title: 'Copying' }))
                .pipe(gulp.dest(target))
                .on('end', cb);
        }
    });
};
var runKarma = require('./build/gulp-tasks/run-karma')(buildOptions, browserSync);
var runTests = function (singleRun, cb, onTestRunCompleted) {
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
var testCoverage = function (cb, singleRun) {
    singleRun = typeof singleRun === 'boolean' ? singleRun : false;
    return require('./build/gulp-tasks/test-coverage')(buildOptions, gulp, runTests, singleRun)(cb);
};

gulp.task('copy-sources', require('./build/gulp-tasks/copy-sources')(buildOptions, gulp));

gulp.task('copy-dependencies', cb => {
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
        }
    ], cb);
});

gulp.task('compile-less', ['copy-sources'], compileLess);

gulp.task('compile-typescript', ['install-typings', 'copy-sources'], compileTypescript);

gulp.task('update-version', ['copy-sources'], require('./build/gulp-tasks/update-version')(buildOptions, gulp));

gulp.task('package-project', [
    'copy-dependencies',
    'compile-less',
    'compile-typescript',
    'update-version'],
    require('./build/gulp-tasks/package-project')(buildOptions, gulp, './node_modules/sdl-packager/Source/bin/Release/Packager.exe'));

gulp.task('run-tslint', runTSLint);

gulp.task('copy-catalina', copyCatalina);

gulp.task('add-coverage', ['compile-typescript'], require('./build/gulp-tasks/add-coverage')(buildOptions, gulp));

gulp.task('test-coverage', testCoverage);

gulp.task('install-typings', function () {
    var stream = gulp.src("./typings.json")
        .pipe(gulpTypings());
    return stream;
});

// Common tasks
gulp.task('build', [
    'install-typings',
    'copy-dependencies',
    'copy-sources',
    'compile-less',
    'compile-typescript',
    'run-tslint',
    'add-coverage',
    'package-project',
    'update-version']);

gulp.task('build:dist', cb => {
    buildOptions.isDebug = false;
    runSequence('clean', 'copy-catalina', 'build', err => {
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
            buildOptions.isTestCoverage = false;

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
        'copy-catalina',
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
        'copy-catalina',
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
    var date = (new Date).toUTCString();
    console.error(date + ' uncaughtException:', err.message);
    console.error(err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
    var date = (new Date).toUTCString();
    console.error(date + ' Unhandled Rejection at: Promise ', p, ' reason: ', reason);
    process.exit(1);
});
