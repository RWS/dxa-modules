<#
.SYNOPSIS
   Imports the 51 Degrees Module into CMS
.EXAMPLE
   & .\cms-import.ps1 -cmsUrl "http://localhost:81" -licenseKey YOUR_51_DEGREES_LICENSE_KEY
#>

[CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$false)]
param (
    [ValidateSet("module-and-permissions", "module-only", "permissions-only")]
    [string]$importType = "module-and-permissions",

    # The URL of the CMS you want to import in
    [Parameter(Mandatory=$true, HelpMessage="URL of the CMS you want to import in")]
    [string]$cmsUrl,

    # Your 51 Degrees License Key (for Premium or Enterprise subscription). Can be left empty for 51 Degrees Lite.
    [Parameter(Mandatory=$true, HelpMessage="Your 51 Degrees License Key (for Premium or Enterprise subscription). Can be left empty for 51 Degrees Lite")]
    [AllowEmptyString()]
    [string]$licenseKey,

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
if (!($pscmdlet.ShouldProcess($cmsUrl, "Import DXA 51 Degrees Module"))) { return }


function Set-51DegreesConfig($licenseKey)
{
    $configComponentWebDavUrl = "/webdav/$masterPublication/$rootFolder/Settings/51Degrees/Site Manager/51 Degrees Configuration.xml"    
    $configComponent = $coreServiceClient.TryRead($configComponentWebDavUrl, $defaultReadOptions)
    if (!$configComponent)
    {
        Write-Warning "Configuration Component not found: '$configComponentWebDavUrl'" 
        return
    }
    if (!$licenseKey)
    {
        Write-Warning "LicenseKey is not specified" 
        return
    }

    $contentDoc = [xml] $configComponent.Content
    $ns = @{e='http://www.sdl.com/web/schemas/51degrees'}
    $node = $contentDoc | Select-Xml "//e:Degrees51Configuration/e:licenseKey" -Namespace $ns

    if ($node)
    {
        $node = $node | Select-Object -ExpandProperty Node
        $node.ParentNode.RemoveChild($node) | Out-Null
    }

    $licenseKeyElement = $contentDoc.CreateElement("licenseKey", "http://www.sdl.com/web/schemas/51degrees")
    $licenseKeyElement.InnerText = $licenseKey
    $contentDoc.DocumentElement.AppendChild($licenseKeyElement) | Out-Null
    $configComponent.Content = $contentDoc.OuterXml

    Write-Host "Updating Configuration Component '$configComponentWebDavUrl' ($($configComponent.Id))"
    Write-Verbose "Updated Content: $($configComponent.Content)" 
    
    $coreServiceClient.Update($configComponent, $null)
}

#Initialization
$tempFolder = Get-TempFolder "DXA"
$distSource = Join-Path (Split-Path $MyInvocation.MyCommand.Path) "\"
$distSource = $distSource.TrimEnd("\") + "\"
$cmsUrl = $cmsUrl.TrimEnd("/") + "/"

$importPackageFullPath = Join-Path $distSource "module-51Degrees.zip"
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
    Import-CmPackage $importPackageFullPath $tempFolder $detailedMapping
    Set-51DegreesConfig $licenseKey
}

#   NOTE - this should be executed last after importing all modules and does not work for mapped publications
if ($importType -ne "module-only")
{
    Import-Security $permissionsFullPath $coreServiceClient
}

$coreServiceClient.Dispose()