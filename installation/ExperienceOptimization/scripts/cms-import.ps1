﻿<#
.SYNOPSIS
   Import the Experience Optimization Module into CMS
.DESCRIPTION
   Import the Experience Optimization (a.k.a. SmartTarget) Module into CMS
.EXAMPLE
   & .\cms-import.ps1 -cmsUrl "http://localhost:81/" 
#>

[CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$false)]
param (
    [ValidateSet("module-and-permissions", "module-only", "permissions-only")]
    [string]$importType = "module-and-permissions",

    # Enter your cms url
    [Parameter(Mandatory=$true, HelpMessage="URL of the CMS you want to import in")]
    [string]$cmsUrl,

    # Title of the Publication containing the DXA Master items
    [Parameter(Mandatory=$false, HelpMessage="Title of the Publication containing the DXA Master items")]
    [string]$masterPublication = "100 Master",

    # Title of the Site Type Publication
    [Parameter(Mandatory=$false, HelpMessage="Title of the Site Type Publication")]
    [string]$siteTypePublication = "110 DXA Site Type",

    # Title of the Content Publication
    [Parameter(Mandatory=$false, HelpMessage="Title of the Content Publication")]
    [string]$contentPublication = "200 Example Content",

    # Title of the Site Publication
    [Parameter(Mandatory=$false, HelpMessage="Title of the Site Publication")]
    [string]$sitePublication = "400 Example Site",

    # Title of the Root Structure Group
    [Parameter(Mandatory=$false, HelpMessage="Title of the Root Structure Group")]
    [string]$rootStructureGroup = "Home",

    # Title of the Root Folder
    [Parameter(Mandatory=$false, HelpMessage="Title of the Root Folder")]
    [string]$rootFolder = "Building Blocks",

    # By default, the current Windows user's credentials are used, but it is possible to specify alternative credentials:
    [Parameter(Mandatory=$false, HelpMessage="CMS User name")]
    [string]$cmsUserName,
    [Parameter(Mandatory=$false, HelpMessage="CMS User password")]
    [string]$cmsUserPassword,
    [Parameter(Mandatory=$false, HelpMessage="CMS Authentication type")]
    [ValidateSet("Windows", "Basic")]
    [string]$cmsAuth = "Windows"
)

#Include functions from ContentManagerUtils.ps1
$PSScriptDir = Split-Path $MyInvocation.MyCommand.Path
$importExportFolder = Join-Path $PSScriptDir "..\..\ImportExport"
. (Join-Path $importExportFolder "ContentManagerUtils.ps1")

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

#Process 'WhatIf' and 'Confirm' options
if (!($pscmdlet.ShouldProcess($cmsUrl, "Import DXA Experience Optimization Module"))) { return }

#Initialization
$IsInteractiveMode = !((gwmi -Class Win32_Process -Filter "ProcessID=$PID").commandline -match "-NonInteractive") -and !$NonInteractive

$distSource = Join-Path (Split-Path $MyInvocation.MyCommand.Path) "\"

$tempFolder = Get-TempFolder "DXA"

#Format data
$distSource = $distSource.TrimEnd("\") + "\"
$cmsUrl = $cmsUrl.TrimEnd("/") + "/"

$importPackageFullPath = Join-Path $distSource "module-ExperienceOptimization.zip"
Write-Verbose "Import Package FullPath is '$importPackageFullPath'"

$permissionsFullPath = Join-Path $distSource "permissions.xml"
Write-Verbose "Permissions file FullPath is '$permissionsFullPath'"

Initialize-ImportExport $importExportFolder $tempFolder

# Create core service client and default read options
$coreServiceClient = Get-CoreServiceClient "Service"
$defaultReadOptions = New-Object Tridion.ContentManager.CoreService.Client.ReadOptions
$cmsVersion = $coreServiceClient.GetApiVersion()

$detailedMapping = Get-ImportMappings $masterPublication $siteTypePublication $contentPublication $sitePublication $rootFolder $rootStructureGroup

if (!$cmsVersion.StartsWith("7."))
{
    # The CM package assumes ST 2014 SP1 naming; on SDL Web 8, we have to map it to "Experience Optimization" naming.
    $detailedMapping += (
        (New-Object Tridion.ContentManager.ImportExport.Packaging.V2013.Mapping2013("Folder", "/webdav/100 Master/Building Blocks/Default Templates/SmartTarget", "/webdav/$masterPublication/$rootFolder/Default Templates/Experience Optimization" )),
        (New-Object Tridion.ContentManager.ImportExport.Packaging.V2013.Mapping2013("TemplateBuildingBlock", "/webdav/100 Master/Building Blocks/Default Templates/SmartTarget/Add to SmartTarget.tbbcs", "/webdav/$masterPublication/$rootFolder/Default Templates/Experience Optimization/Add to Experience Optimization.tbbcs" ))
    )
}

if ($importType -ne "permissions-only")
{
    Import-CmPackage $importPackageFullPath $tempFolder $detailedMapping
}

#   NOTE - this should be executed last after importing all modules and does not work for mapped publications
if ($importType -ne "module-only")
{
    Import-Security $permissionsFullPath $coreServiceClient
}

$coreServiceClient.Dispose()
