<#
.SYNOPSIS
   Deploys the DXA Context Expressions Module in a DXA Web Application
.EXAMPLE
   .\web-install.ps1 -distDestination "c:\inetpub\wwwroot\mysite" 
#>

[CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$false)]
Param(
    #The file system path of the root folder of your DXA Web Application
    [Parameter(Mandatory=$true, HelpMessage="The file system path of the root folder of your DXA Web Application")]
    [string]$distDestination,

    #The version of CIS you a using. Can be '8.1.1' or '8.5'.
    [Parameter(Mandatory=$true, HelpMessage="The version of CIS you a using. Can be '8.1.1' or '8.5'.")]
    [ValidateSet("8.1.1", "8.5")]
    [string]$cisVersion
)

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

#Include functions from DxaDeployUtils.ps1
$PSScriptDir = Split-Path $MyInvocation.MyCommand.Path
. (Join-Path $PSScriptDir "..\DxaDeployUtils.ps1")

#Process 'WhatIf' and 'Confirm' options
if (!($pscmdlet.ShouldProcess($distDestination, "Deploy the DXA Context Expressions Module"))) { return }

$distSource = $PSScriptDir
$distSource = $distSource.TrimEnd("\")
$distDestination = $distDestination.TrimEnd("\")

Write-Host "Copying files to '$distDestination' ..."
Copy-Item $distSource\web\* $distDestination -Recurse -Force

$webConfigFile = "$distDestination\Web.config"
Write-Host "Updating '$webConfigFile' ..."
[xml] $webConfigDoc = Get-Content $webConfigFile
if ($cisVersion.StartsWith("8.1"))
{
    $claimsProviderType = "AdfContextClaimsProvider"
    Enable-AmbientFrameworkModule $webConfigDoc
}
else
{
    $claimsProviderType = "ContextServiceClaimsProvider"
    Set-AppSetting "context-service-publication-evidence" "true" $webConfigDoc
}
Add-ModelBuilder "Sdl.Web.Modules.ContextExpressions.ContextExpressionModelBuilder, Sdl.Web.Modules.ContextExpressions" $webConfigDoc
$webConfigDoc.Save($webConfigFile)

$unityConfigFile = "$distDestination\Unity.config"
Write-Host "Updating '$unityConfigFile' ..."
[xml] $unityConfigDoc = Get-Content $unityConfigFile
Add-UnityDeclaration "assembly" "Sdl.Web.Modules.ContextExpressions" $unityConfigDoc
Add-UnityDeclaration "namespace" "Sdl.Web.Modules.ContextExpressions" $unityConfigDoc
Set-UnityTypeMapping "IConditionalEntityEvaluator" "ContextExpressionEvaluator" $unityConfigDoc
Set-UnityTypeMapping "IContextClaimsProvider" $claimsProviderType $unityConfigDoc
$unityConfigDoc.Save($unityConfigFile)

$cdAmbientConfigFile = "$distDestination\bin\config\cd_ambient_conf.xml"
Write-Host "Updating '$cdAmbientConfigFile' ..."
[xml] $cdAmbientConfigDoc = Get-Content $cdAmbientConfigFile
Add-CdAmbientClaim "taf:request:headers" "/Configuration/ForwardedClaims" $cdAmbientConfigDoc
Add-CdAmbientClaim "taf:request:full_url" "/Configuration/ForwardedClaims" $cdAmbientConfigDoc
$cdAmbientConfigDoc.Save($cdAmbientConfigFile)
