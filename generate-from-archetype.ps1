$ErrorActionPreference = "STOP"

Function Execute-Command($executable, $arguments) { 
    try {
        & $executable $arguments
    } Catch {
        if ($_.Exception.Message -notlike "npm WARN*") {
            throw $_.Exception
        }
    }
}

$startLocation = Get-Location

Push-Location $PSScriptRoot

Write-Output "Getting version from Pom"
[xml]$pomXml = Get-Content "webapp-archetype/pom.xml"
$version = $pomXml.project.version
Write-Output "Getting version from Pom finished"

Write-Output "Force install npm packages"
# This is needed to make sure we have the latests @sdl/... packages. As they get overwritten on publish we could have an old version in the cache
Push-Location "$PSScriptRoot/webapp-archetype/gui"
Execute-Command "npm" @("install", "--force")
Pop-Location
Write-Output "Force install npm packages finished"

Write-Output "Copying theming directory"
$archetTypeThemingDirectory = "webapp-archetype/gui/src/theming"
if (Test-Path $archetTypeThemingDirectory) {
    Remove-Item $archetTypeThemingDirectory -Recurse
}
Copy-Item -Path "gui/src/theming" -Destination $archetTypeThemingDirectory -Recurse
Write-Output "Copying theming directory finished"

Write-Output "Building archetype project"
Execute-Command "mvn" @("-f", "webapp-archetype/pom.xml", "clean", "package")
Write-Output "Building archetype project finished"

Write-Output "Creating archetype from project"
Execute-Command "mvn" @("-f", "webapp-archetype/pom.xml", "org.apache.maven.plugins:maven-archetype-plugin:3.0.0:create-from-project", "-Darchetype.properties=archetype.properties")
Execute-Command "mvn" @("-f", "webapp-archetype/target/generated-sources/archetype/pom.xml", "install")
Write-Output "Creating archetype from project finished"

Write-Output "Creating example project from archetype"
$newProjectDirectory = "$PSScriptRoot/webapp-archetype/target/webapp-from-archetype";
if ((Test-Path $newProjectDirectory) -eq $false) {
    New-Item  -type directory $newProjectDirectory
}
Push-Location $newProjectDirectory
Execute-Command "mvn" @("archetype:generate", "-B", "-DarchetypeCatalog=local", "-DarchetypeGroupId=com.sdl.delivery.ish",    
    "-DarchetypeArtifactId=dd-webapp-archetype", "-DarchetypeVersion=$version", "-DgroupId=org.example", "-DartifactId=webapp",
    "-Dversion=$version", "-Dpackage=org.example")
Write-Output "Creating example project from archetype finished"

<#
Write-Output "Building project generated from archetype"
Execute-Command "mvn" @("-f", "webapp/pom.xml", "clean", "package")
Write-Output "Building project generated from archetype finished"
#>

Push-Location $startLocation