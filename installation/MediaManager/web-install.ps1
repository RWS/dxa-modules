<#
.Synopsis
   Deploys Media Manager module to web application
.DESCRIPTION
   Deploys Media Manager module to web application
.EXAMPLE
   & '.\web-install.ps1' -distDestination "c:\inetpub\wwwroot\mysite" 
.INPUTS
   distDestination
.NOTES
   General notes
.COMPONENT
   The component this cmdlet belongs to
.ROLE
   The role this cmdlet belongs to
.FUNCTIONALITY
   The functionality that best describes this cmdlet
#>

[CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$false)]
Param(
    [Parameter(Mandatory=$true, HelpMessage="File system path of the root folder of DXA Website")]
    [string]$distDestination
)

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

#Process 'WhatIf' and 'Confirm' options
if (!($pscmdlet.ShouldProcess("System", "Deploy Media Manager module in web application"))) { return }

#Initialization
$IsInteractiveMode = !((gwmi -Class Win32_Process -Filter "ProcessID=$PID").commandline -match "-NonInteractive") -and !$NonInteractive

$distSource = (Resolve-Path (Join-Path (Split-Path $MyInvocation.MyCommand.Path) "web\")).Path

#Format data
$distSource = $distSource.TrimEnd("\")
$distDestination = $distDestination.TrimEnd("\")

#Copy files
Copy-Item $distSource\* $distDestination -Recurse -Force
Write-Output ("Copied views and DLLs for Media Manager module")


