﻿<#
.SYNOPSIS
   Imports the DXA Search Module into your CMS.
.EXAMPLE
   .\cms-import.ps1 -cmsUrl "http://localhost:81/" 
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

	# By default, the SI4T based package module will be imported
	[ValidateSet("SI4TSearch", "SitesSearch")]
    [string]$cmsPackageImportSearchType = "SI4TSearch",

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
if (!($pscmdlet.ShouldProcess($cmsUrl, "Import DXA Search Module"))) { return }

$distSource = Join-Path (Split-Path $MyInvocation.MyCommand.Path) "\"

$tempFolder = Get-TempFolder "DXA"

#Format data
$distSource = $distSource.TrimEnd("\") + "\"
$cmsUrl = $cmsUrl.TrimEnd("/") + "/"

$importPackageFullPath = Join-Path $distSource  "module-Search.zip"
Write-Verbose "Import Package FullPath is '$importPackageFullPath'"

$permissionsFullPath = Join-Path $distSource "permissions.xml"
Write-Verbose "Permissions file FullPath is '$permissionsFullPath'"

Initialize-ImportExport $importExportFolder $tempFolder

# Create core service client and default read options
$coreServiceClient = Get-CoreServiceClient "Service"
$defaultReadOptions = New-Object Tridion.ContentManager.CoreService.Client.ReadOptions

$detailedMapping = Get-ImportMappings $masterPublication $siteTypePublication $contentPublication $sitePublication $rootFolder $rootStructureGroup

if ($importType -ne "permissions-only")
{
    $masterRootFolderWebDavUrl = Encode-WebDav "$masterPublication/$rootFolder"
    $masterRootSgWebDavUrl = Encode-WebDav "$masterPublication/$rootStructureGroup"
    $siteRootFolderWebDavUrl = Encode-WebDav "$sitePublication/$rootFolder"
    $siteRootSgWebDavUrl = Encode-WebDav "$sitePublication/$rootStructureGroup"
    $siteTypeRootFolderWebDavUrl = Encode-WebDav "$siteTypePublication/$rootFolder"
    $siteTypeRootSgWebDavUrl = Encode-WebDav "$siteTypePublication/$rootStructureGroup"

    if($cmsPackageImportSearchType -ne "SI4TSearch")
	{
		$cmsVersion = "sites10"
		Import-CmPackage $importPackageFullPath $tempFolder $detailedMapping $cmsVersion
	}
	else
	{
		Import-CmPackage $importPackageFullPath $tempFolder $detailedMapping
	}

    if(Is-Web8) 
    {
        Add-ComponentPresentation `
            "$siteRootFolderWebDavUrl/Modules Content/Search/Search Box Configuration.xml" `
            "$siteRootFolderWebDavUrl/Modules/Search/Site Manager/Templates/Search Box [Nav].tctcmp" `
            "$siteRootSgWebDavUrl/_System/include/Header.tpg"
    }
    else
    {
          Add-ComponentPresentation `
            "$siteRootFolderWebDavUrl/Modules Content/Search/Search Box Configuration.xml" `
            "$siteRootFolderWebDavUrl/Modules/Search/Site Manager/Templates/Search Box.tctcmp" `
            "$siteRootSgWebDavUrl/_System/include/Header.tpg" `
            -regionName "Nav"
    }
  
	if($cmsPackageImportSearchType -ne "SitesSearch")
	{
		Add-TemplateToCompound `
			"$masterRootFolderWebDavUrl/Modules/Search/Developer/Search Template Building Blocks/Enable Search Indexing.tbbcmp" `
			"$masterRootFolderWebDavUrl/Framework/Developer/Templates/DXA.R2/Default Page Template Finish Actions.tbbcmp" 

		Add-MetadataToItem `
			"$masterRootSgWebDavUrl/_System" `
			"$masterRootFolderWebDavUrl/Modules/Search/Editor/Schemas/Search Indexing Metadata.xsd" `
			"<Metadata xmlns=""http://www.sdl.com/web/schemas/search""><NoIndex>Yes</NoIndex></Metadata>"

		Add-MetadataToItem `
			"$siteTypeRootSgWebDavUrl/_Error Page Not Found.tpg" `
			"$siteTypeRootFolderWebDavUrl/Modules/Search/Editor/Schemas/Search Indexing Metadata.xsd" `
			"<Metadata xmlns=""http://www.sdl.com/web/schemas/search""><NoIndex>Yes</NoIndex></Metadata>"    
	}
}

#   NOTE - this should be executed last after importing all modules and does not work for mapped publications
if ($importType -ne "module-only")
{
    Import-Security $permissionsFullPath $coreServiceClient
}

$coreServiceClient.Dispose()
