# Utility functions

$nexusUrl = 'https://dist.nuget.org/win-x86-commandline/latest/nuget.exe';

function GetNuget([string] $programmUrl, [string] $targetPath)
{
    if (!(Test-Path "$targetPath\nuget.exe"))
    {
        Write-Host "Getting NuGet programm from $programmUrl to $targetPath directory...";
        Invoke-WebRequest -Uri $programmUrl -OutFile "$targetPath\nuget.exe";
        Write-Host "NuGet programm has been successfully downloaded to $targetPath directory.";
    }
}

function Pack-Package
{
    param (
        [string] $nuspecFilePath,
        [string] $packageVersion,
        [string] $outputPath
    )

    GetNuget $nexusUrl $PSScriptRoot;

    Write-Host "Creating NuGet package that will be published to nexus.";
    & .\nuget.exe pack $nuspecFilePath -Version $packageVersion -OutputDirectory $outputPath;
}

function Push-Package
{
    param (
        [string] $packagePath,
        [string] $nuGetApiKey,
        [string] $nexusSource
    )

    GetNuget $nexusUrl $PSScriptRoot;

    & .\nuget.exe push $packagePath -ApiKey $nuGetApiKey -Source $nexusSource -Verbosity detailed -NonInteractive;
}
