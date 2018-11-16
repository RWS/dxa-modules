#
# Copyright (c) 2014 All Rights Reserved by the SDL Group.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

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
