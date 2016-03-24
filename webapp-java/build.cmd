@ECHO OFF

REM Usage: build.cmd command
REM command is passed to mvn as it is
REM E.g. 'build.cmd clean install -Pweb8' will be 'mvn -f project-name\pom.xml clean install -Pweb8'

echo Building DXA Modules...

if "%*" == "" ( set command=clean install ) else ( set command=%* )

call mvn -f dxa-module-cid\pom.xml %command% || exit /b %errorlevel%
call mvn -f dxa-module-core\pom.xml %command% || exit /b %errorlevel%
call mvn -f dxa-module-googleanalytics\pom.xml %command% || exit /b %errorlevel%
call mvn -f dxa-module-mediamanager\pom.xml %command% || exit /b %errorlevel%
call mvn -f dxa-module-search\pom.xml %command% || exit /b %errorlevel%
call mvn -f dxa-module-smarttarget-abstract\pom.xml %command% || exit /b %errorlevel%
call mvn -f dxa-module-smarttarget-2013sp1\pom.xml %command% || exit /b %errorlevel%
call mvn -f dxa-module-smarttarget-web8\pom.xml %command% || exit /b %errorlevel%
call mvn -f dxa-module-51degrees\pom.xml %command% || exit /b %errorlevel%

echo We are done :)

if "%*" == "" (
	echo Press any key to continue...
	pause > nul
)

@ECHO ON
