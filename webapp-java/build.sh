#!/usr/bin/env bash

# Usage: build.sh command
# command is passed to mvn as it is
# E.g. 'build.sh clean install -Pweb8' will be 'mvn -f project-name/pom.xml clean install -Pweb8'

echo "Building DXA Modules..."

command=$@
initialCommand="exists"
if [ -z "$command" ]; then
	initialCommand=""
	command="clean install"
fi

mvn -f dxa-module-cid/pom.xml ${command} || exit $?
mvn -f dxa-module-core/pom.xml ${command} || exit $?
mvn -f dxa-module-googleanalytics/pom.xml ${command} || exit $?
mvn -f dxa-module-mediamanager/pom.xml ${command} || exit $?
mvn -f dxa-module-search/pom.xml ${command} || exit $?
mvn -f dxa-module-smarttarget-abstract/pom.xml ${command} || exit $?
mvn -f dxa-module-smarttarget-2013sp1/pom.xml ${command} || exit $?
mvn -f dxa-module-smarttarget-web8/pom.xml ${command} || exit $?
mvn -f dxa-module-51degrees/pom.xml ${command} || exit $?

echo "We are done :)"

if [ -z "${initialCommand}" ]; then
	read -n1 -r -p "Press any key to continue..." key
fi
