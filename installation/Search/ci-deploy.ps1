<#
.SYNOPSIS
   Performs Search module deployment actions for Continuous Integration environment
#>

[CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$false)]
Param(
    [Parameter(Mandatory=$true, HelpMessage="File system path of the root folder of DXA Website")]
    [string]$distDestination,
    [Parameter(Mandatory=$false, HelpMessage="The type name of the Search Provider to use. Can be 'SolrProvider' or 'AwsCloudSearchProvider'.")]
    [ValidateSet("SolrProvider", "AwsCloudSearchProvider")]
    $searchProviderType = "SolrProvider"
)

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

#Include functions from DxaDeployUtil.ps1
$PSScriptDir = Split-Path $MyInvocation.MyCommand.Path
. (Join-Path $PSScriptDir "..\DxaDeployUtils.ps1")

$unityConfigFile = "$distDestination\Unity.config"
Write-Host "Updating '$unityConfigFile' ..."
[xml] $unityConfigDoc = Get-Content $unityConfigFile
Add-UnityDeclaration "assembly" "Sdl.Web.Modules.Search" $unityConfigDoc
Add-UnityDeclaration "namespace" "Sdl.Web.Modules.Search.Providers" $unityConfigDoc
Set-UnityTypeMapping "ISearchProvider" $searchProviderType $unityConfigDoc
$unityConfigDoc.Save($unityConfigFile)
