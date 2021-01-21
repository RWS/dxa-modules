<#
.SYNOPSIS
   Deploys the DXA Dynamic Documentation Module in the DXA Web Application
.EXAMPLE
   .\web-install.ps1 -distDestination "c:\inetpub\wwwroot\mysite" 
#>

    [CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$false)]
Param(
#The file system path of the root folder of your DXA Web Application
    [Parameter(Mandatory=$true, HelpMessage="The file system path of the root folder of your DXA Web Application")]
    [string]$DistDestination,

    [Parameter(Mandatory=$false, HelpMessage="The registry where all needed NMP packages lay")]
    [string]$npmRegistry="https://nexus.sdl.com/content/groups/npm/",

    [Parameter(Mandatory=$false, HelpMessage="The registry where all needed NMP packages lay")]
    [string]$UiTargetPath,

    [Parameter(Mandatory=$false)]
    [string]$Batch = "false",

    [Parameter(Mandatory=$false)]
    [string]$BuildUi = "false"
)

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

#Include functions from DxaDeployUtils.ps1
. (Join-Path $PSScriptRoot "..\DxaDeployUtils.ps1")

#Process 'WhatIf' and 'Confirm' options
if (!($pscmdlet.ShouldProcess($DistDestination, "Deploy the DXA DynamicDocumentation Module"))) { return }

# Begin install steps
Write-Host "Installing DynamicDocumentation Module..."

$distSource = (Resolve-Path (Join-Path (Split-Path $MyInvocation.MyCommand.Path) "web\")).Path.TrimEnd("\")
$defaultGuiTarget = Join-Path $DistDestination "\system\assets\gui";
$guiSource = Join-Path $distSource "\gui";


$defaultBuildConfirmation="no";

if ($BuildUi -eq "true")
{
    Write-Host "
Building Dynamic Documentation GUI...
Note that you need Gulp CLI, NodeJS(v6.11.2) and Npm(4.6.1) installed.
"
    if ($Batch -eq "false")
    {
        Write-Host "
There is posibility to customize your GUI.
To do that you need:
    1. On the next question answer No
    2. Go to the folder witn Dynamic Documentation GUI Boilerplate($distSource\gui)
    3. Make some customizations according to documentation here: https://github.com/sdl/dd-webapp-custom-examples
    4. Run this script again
"
        $continueToBuild = Read-Host("Do you want to continue building GUI, 'yes' or 'no' (Default: $defaultConfirmation)");
    }
    else
    {
        $continueToBuild = "yes";
    }
}


$continueToBuild = ($defaultBuildConfirmation,$continueToBuild)[[bool]$continueToBuild]

if($continueToBuild.ToLower() -eq "yes") {
    Try {
        # We must go to the root of GUI project in order to use napa correctly, it doesn't work when using npm with --prefix parameter
        Push-Location "$guiSource"

        npm install -registry $npmRegistry
        if ($LASTEXITCODE -ne 0)  { throw "Error running 'npm install' command. Exited with: $LASTEXITCODE" }
        npm run-script build
        if ($LASTEXITCODE -ne 0)  { throw "Error running 'run-script build' command. Exited with: $LASTEXITCODE" }
    } Catch {
        $ErrorMessage = $_.Exception.Message
        Write-Error "Error has occured while building GUI. Reason: $ErrorMessage"
    } Finally {
        Pop-Location
    }
}

Write-Host "Copying files to '$DistDestination' ..."
Copy-Item (Join-Path $distSource "Areas") $DistDestination -Recurse -Force;
Copy-Item (Join-Path $distSource "bin") $DistDestination -Recurse -Force;

if($UiTargetPath -eq $null) {
    if ($Batch -eq "false") {
        $uiTargetPath = Read-Host -Prompt "Enter path where GUI should be copied (Default: $defaultGuiTarget)";
    }
}

$UiTargetPath = ($defaultGuiTarget,$UiTargetPath)[[bool]$UiTargetPath]

if(!(Test-Path "$UiTargetPath")) {
    New-Item -Path "$UiTargetPath" -ItemType Directory | Out-Null
}
Copy-Item (Join-Path $guiSource "dist\assets") "$UiTargetPath" -Recurse -Force

Write-Host "Updating Web.config ..."

$webConfigFile = "$DistDestination\Web.config"
[xml] $webConfigDoc = Get-Content $webConfigFile

Add-ModelBuilder "Sdl.Web.Modules.DynamicDocumentation.Mapping.ModelBuilder, Sdl.Web.Modules.DynamicDocumentation" $webConfigDoc $true
Set-AppSetting "default-module" "DynamicDocumentation" $webConfigDoc

$webConfigDoc.Save($webConfigFile)

Write-Host "Updating Unity.config ..."

$unityConfigFile = "$DistDestination\Unity.config"
[xml] $unityConfigDoc = Get-Content $unityConfigFile

Add-UnityDeclaration "assembly" "Sdl.Web.Modules.DynamicDocumentation" $unityConfigDoc
Add-UnityDeclaration "namespace" "Sdl.Web.Modules.DynamicDocumentation.Localization" $unityConfigDoc
Add-UnityDeclaration "namespace" "Sdl.Web.Modules.DynamicDocumentation.Providers" $unityConfigDoc
Set-UnityTypeMapping "INavigationProvider" "DynamicNavigationProvider" $unityConfigDoc
Set-UnityTypeMapping "ILocalizationResolver" "DynamicDocumentationLocalizationResolver" $unityConfigDoc

$unityConfigDoc.Save($unityConfigFile)

$cdAmbientConfigFile = "$distDestination\bin\config\cd_ambient_conf.xml"
Write-Host "Updating '$cdAmbientConfigFile' ..."
[xml] $cdAmbientConfigDoc = Get-Content $cdAmbientConfigFile
Add-CdAmbientClaim "taf:ish:userconditions:merged" "/Configuration/ForwardedClaims" $cdAmbientConfigDoc
Add-CdAmbientClaim "taf:ish:userconditions:merged" "/Configuration/Security/GloballyAcceptedClaims" $cdAmbientConfigDoc
$cdAmbientConfigDoc.Save($cdAmbientConfigFile)