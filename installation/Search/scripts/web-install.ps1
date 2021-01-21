<#
.SYNOPSIS
   Deploys the DXA Search module in a DXA Web Application
.EXAMPLE
   .\web-install.ps1 -distDestination "c:\inetpub\wwwroot\mysite" 
#>

[CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$false)]
Param(
    #The file system path of the root folder of your DXA Web Application
    [Parameter(Mandatory=$true, HelpMessage="The file system path of the root folder of your DXA Web Application")]
    [string]$distDestination,

    #The type name of the Search Provider to use. Can be 'SolrProvider' or 'AwsCloudSearchProvider'.
    [Parameter(Mandatory=$false, HelpMessage="The type name of the Search Provider to use. Can be 'SolrProvider' or 'AwsCloudSearchProvider'.")]
    [ValidateSet("SolrProvider", "AwsCloudSearchProvider")]
    $searchProviderType = "SolrProvider"
)

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

#Include functions from DxaDeployUtils.ps1
$PSScriptDir = Split-Path $MyInvocation.MyCommand.Path
. (Join-Path $PSScriptDir "..\DxaDeployUtils.ps1")

#Process 'WhatIf' and 'Confirm' options
if (!($pscmdlet.ShouldProcess($distDestination, "Deploy the DXA Search Module"))) { return }

$distSource = (Resolve-Path (Join-Path (Split-Path $MyInvocation.MyCommand.Path) "web\")).Path
$distSource = $distSource.TrimEnd("\")
$distDestination = $distDestination.TrimEnd("\")

Write-Host "Copying files to '$distDestination' ..."
Copy-Item $distSource\* $distDestination -Recurse -Force

$unityConfigFile = "$distDestination\Unity.config"
Write-Host "Updating '$unityConfigFile' ..."
[xml] $unityConfigDoc = Get-Content $unityConfigFile
Add-UnityDeclaration "assembly" "Sdl.Web.Modules.Search" $unityConfigDoc
Add-UnityDeclaration "namespace" "Sdl.Web.Modules.Search.Providers" $unityConfigDoc
Set-UnityTypeMapping "ISearchProvider" $searchProviderType $unityConfigDoc
$unityConfigDoc.Save($unityConfigFile)
