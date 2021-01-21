<#
.SYNOPSIS
   Deploys the DXA ContentMashups Module in the DXA Web Application
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

#Process 'WhatIf' and 'Confirm' options
if (!($pscmdlet.ShouldProcess($distDestination, "Deploy the DXA ContentMashups Module"))) { return }

$distSource = (Resolve-Path (Join-Path (Split-Path $MyInvocation.MyCommand.Path) "web\")).Path
$distSource = $distSource.TrimEnd("\")
$distDestination = $distDestination.TrimEnd("\")

Write-Host "Copying files to '$distDestination' ..."
Copy-Item $distSource\* $distDestination -Recurse -Force
