<#
.SYNOPSIS
   Performs Context Expressions Module deployment actions for Continuous Integration environment
#>

[CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$false)]
Param(
    [Parameter(Mandatory=$true, HelpMessage="File system path of the root folder of DXA Website")]
    [string]$distDestination
)

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

#Include functions from DxaDeployUtil.ps1
$PSScriptDir = Split-Path $MyInvocation.MyCommand.Path
. (Join-Path $PSScriptDir "..\DxaDeployUtils.ps1")

$webConfigFile = "$distDestination\Web.config"
Write-Host "Updating '$webConfigFile' ..."
[xml] $webConfigDoc = Get-Content $webConfigFile
Add-ModelBuilder "Sdl.Web.Modules.ContextExpressions.ContextExpressionModelBuilder, Sdl.Web.Modules.ContextExpressions" $webConfigDoc
$webConfigDoc.Save($webConfigFile)


$unityConfigFile = "$distDestination\Unity.config"
Write-Host "Updating '$unityConfigFile' ..."
[xml] $unityConfigDoc = Get-Content $unityConfigFile
Add-UnityDeclaration "assembly" "Sdl.Web.Modules.ContextExpressions" $unityConfigDoc
Add-UnityDeclaration "namespace" "Sdl.Web.Modules.ContextExpressions" $unityConfigDoc
Set-UnityTypeMapping "IConditionalEntityEvaluator" "ContextExpressionEvaluator" $unityConfigDoc
Set-UnityTypeMapping "IContextClaimsProvider" "AdfContextClaimsProvider" $unityConfigDoc
$unityConfigDoc.Save($unityConfigFile)

