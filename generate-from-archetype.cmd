@echo off
rem Builds the web application example project, 
rem generates archetype using it, 
rem builds a new application from archetype
setlocal
set version="1.0.0-SNAPSHOT"
call mvn -f webapp-archetype\pom.xml clean package
call mvn -f webapp-archetype\pom.xml org.apache.maven.plugins:maven-archetype-plugin:3.0.0:create-from-project -Darchetype.properties=archetype.properties
call mvn -f webapp-archetype\target\generated-sources\archetype\pom.xml install

cd webapp-archetype\target
move dd-webapp-%version%.war dd-webapp-original.war

mkdir webapp-from-archetype
cd webapp-from-archetype
call mvn archetype:generate -B -DarchetypeCatalog=local -DarchetypeGroupId=com.sdl.delivery.ish -DarchetypeArtifactId=dd-webapp-archetype -DarchetypeVersion=%version% -DgroupId=org.example -DartifactId=webapp -Dversion=%version% -Dpackage=org.example

endlocal