<#
.SYNOPSIS
   Deploys the DXA UGC Module in a DXA .NET Web Application
.EXAMPLE
   .\web-install.ps1 -distDestination "c:\inetpub\wwwroot\mysite"
#>

[CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$false)]
Param(
    #The file system path of the root folder of your DXA Web Application
    [Parameter(Mandatory=$true, HelpMessage="The file system path of the root folder of your DXA Web Application")]
    [string]$distDestination
)

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

#Include functions from DxaDeployUtils.ps1
$PSScriptDir = Split-Path $MyInvocation.MyCommand.Path
. (Join-Path $PSScriptDir "..\DxaDeployUtils.ps1")

#Process 'WhatIf' and 'Confirm' options
if (!($pscmdlet.ShouldProcess($distDestination, "Deploy the DXA Ugc Module"))) { return }

# Begin install steps

Write-Host "Installing UGC Module..."

$distSource = (Resolve-Path (Join-Path (Split-Path $MyInvocation.MyCommand.Path) "web\")).Path
$distSource = $distSource.TrimEnd("\")
$distDestination = $distDestination.TrimEnd("\")

Write-Host "Copying files to '$distDestination' ..."
Copy-Item $distSource\* $distDestination -Recurse -Force

Write-Host "Updating Web.config ..."

$webConfigFile = "$distDestination\Web.config"
[xml] $webConfigDoc = Get-Content $webConfigFile
Enable-AmbientFrameworkModule $webConfigDoc
$webConfigDoc.Save($webConfigFile)


Write-Host "Installed UGC Module."
