'use strict';

/**
 * Get coverage report.
 * @module test-coverage
 * @param {Object} buildOptions Build options.
 * @param {Object} gulp Instance of gulp.
 * @param {function} runTests Run all unit tests.
 * @param {boolean=} singleRun Only run the tests once.
 */
module.exports = function (buildOptions, gulp, runTests, singleRun) {
    const glob = require('glob');
    const path = require('path');
    var istanbul = require('istanbul');
    var runSequence = require('run-sequence').use(gulp);
    var chalk = require('chalk');
    var loadCoverage = require('remap-istanbul/lib/loadCoverage');
    var remap = require('remap-istanbul/lib/remap');
    var minCoverage = buildOptions.coverage.minCoverage;
    singleRun = singleRun || false;

    return function (cb) {
        buildOptions.isTest = true;

        var buildReport = function (results) {
            var currentWorkingDir = process.cwd();
            var reportPath = currentWorkingDir + buildOptions.testPath.substring(1) + 'coverage/report/';

            // Collect the results
            var collector = new istanbul.Collector();
            for (var browserId in results) {
                collector.add(results[browserId].coverage);
            }

            // Check if all files are covered
            var allFilesCovered = true;
            var testedFilesCount = Object.keys(collector.store.map).length;
            var instrumentedFiles = glob.sync(`${buildOptions.sourcesPath}**/*.{ts,tsx}`, {
                ignore: [
                    `${buildOptions.sourcesPath}**/*.d.ts`,
                    `${buildOptions.sourcesPath}/Main.tsx`,
                    `${buildOptions.sourcesPath}/interfaces/*.ts`,
                    `${buildOptions.sourcesPath}/services/interfaces/*.ts`,
                    `${buildOptions.sourcesPath}/Lib.ts`
                ]
            }).map(item => {
                let key = item;
                if (path.sep !== '/') {
                    key = key.replace('/', '\\');
                }
                return path.resolve(process.cwd(), key);
            });
            var instrumentedFilesCount = instrumentedFiles.length;
            console.log(chalk.cyan('File coverage report'));
            if (testedFilesCount !== instrumentedFilesCount) {
                allFilesCovered = false;
                console.log(chalk.red('Only ' + testedFilesCount + ' of ' + instrumentedFilesCount + ' files were tested.'));
                for (var i = 0; i < instrumentedFilesCount; i++) {
                    var file = instrumentedFiles[i];
                    if (!collector.store.map.hasOwnProperty(file)) {
                        console.log(chalk.red(file + ' has not been tested.'));
                    }
                }
            } else {
                console.log(chalk.green('All files are covered.'));
            }

            // Create json report
            var jsonReport = istanbul.Report.create('json', { dir: reportPath });
            jsonReport.writeReport(collector, true);

            // Remap the results
            collector = remap(loadCoverage(reportPath + 'coverage-final.json'), {
                basePath: currentWorkingDir + buildOptions.sourcesPath.substring(1)
            });

            // Print full coverage report to console
            var reporter = new istanbul.Reporter();
            reporter.add('text');
            reporter.write(collector, false, function () {
                console.log('All reports generated');
            });

            // Create html report
            var htmlReport = istanbul.Report.create('html', { dir: reportPath });
            htmlReport.writeReport(collector, true);

            // Get the final summary
            var finalSummary = istanbul.utils.summarizeCoverage(collector.getFinalCoverage());

            // Calculate if coverage is met
            var minCoverageSuccess = true;
            var colors = {
                lines: chalk.green,
                branches: chalk.green,
                functions: chalk.green,
                statements: chalk.green
            };
            if (finalSummary.lines.pct < minCoverage.lines) {
                minCoverageSuccess = false;
                colors.lines = chalk.red;
            }
            if (finalSummary.branches.pct < minCoverage.branches) {
                minCoverageSuccess = false;
                colors.branches = chalk.red;
            }
            if (finalSummary.functions.pct < minCoverage.functions) {
                minCoverageSuccess = false;
                colors.functions = chalk.red;
            }
            if (finalSummary.statements.pct < minCoverage.statements) {
                minCoverageSuccess = false;
                colors.statements = chalk.red;
            }

            // Print result
            console.log(chalk.cyan('Code coverage report'));
            console.log('Statements: ' + colors.statements(JSON.stringify(finalSummary.statements)));
            console.log('Branches: ' + colors.branches(JSON.stringify(finalSummary.branches)));
            console.log('Functions: ' + colors.functions(JSON.stringify(finalSummary.functions)));
            console.log('Lines: ' + colors.lines(JSON.stringify(finalSummary.lines)));

            return {
                allFilesCovered: allFilesCovered,
                minCoverageSuccess: minCoverageSuccess
            };
        };
        var onTestRunCompleted = function (results) {
            if (results && Object.keys(results).length > 0) {
                buildReport(results);
            }
        };
        var onTestCompleted = function (err, results) {
            if (err) {
                cb(err);
            } else if (results && Object.keys(results).length > 0) {
                var results = buildReport(results);

                // Fail the build if the minimum coverage is not met
                if (results.minCoverageSuccess && results.allFilesCovered) {
                    cb();
                } else {
                    cb(new Error('Minimum code coverage is not met and/or not all files have been tested.'));
                }
            } else {
                cb(new Error('No coverage results.'));
            }
        };
        runSequence('build', runTests(singleRun, onTestCompleted, onTestRunCompleted));
    };
}
