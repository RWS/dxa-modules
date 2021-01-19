#Requires -Version 3.0
<#
.SYNOPSIS
   Imports the Audience Manager Module into CMS
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

    # Title of the Root Folder
    [Parameter(Mandatory=$false, HelpMessage="Title of the Root Folder")]
    [string]$rootFolder = "Building Blocks",

    # Title of the Root Structure Group
    [Parameter(Mandatory=$false, HelpMessage="Title of the Root Structure Group")]
    [string]$rootStructureGroup = "Home",

    # By default, the current Windows user's credentials are used, but it is possible to specify alternative credentials:
    [Parameter(Mandatory=$false, HelpMessage="CMS User name")]
    [string]$cmsUserName,
    [Parameter(Mandatory=$false, HelpMessage="CMS User password")]
    [string]$cmsUserPassword,
    [Parameter(Mandatory=$false, HelpMessage="CMS Authentication type")]
    [ValidateSet("Windows", "Basic")]
    [string]$cmsAuth = "Windows"
)
function Import-CmPackageNonTransaction($packageFullPath, $tempFolder, $mappings = $null)
{
    $packageFullPathWithCmVersion = Add-CmVersion($packageFullPath)
    Write-Host "Uploading package '$packageFullPathWithCmVersion' ..."
    $filename = (Get-ChildItem $packageFullPathWithCmVersion).BaseName
    $extension = (Get-ChildItem $packageFullPathWithCmVersion).Extension

    $uploadId = Invoke-UploadPackageFromFile $packageFullPathWithCmVersion

    Write-Host "Importing content ..."
    $importInstruction = New-Object Tridion.ContentManager.ImportExport.ImportInstruction
    #$importInstruction.LogLevel = "Debug"
    $importInstruction.ErrorHandlingMode = [Tridion.ContentManager.ImportExport.ErrorHandlingMode]::Skip
    $importInstruction.RunInTransaction = $false
    $importInstruction.LogLevel = "Normal"
    $importInstruction.CreateUndoPackage = $false
    $importInstruction.SchemaSynchronizeFlags = "FixNamespace, RemoveUnknownFields, RemoveAdditionalValues, ApplyDefaultValuesForMissingMandatoryFields, ConvertFieldType"

    if ($mappings)
    {
        Write-Verbose "Using mappings:"
        $mappings | ForEach-Object { Write-Verbose "`t'$($_.ExportUrl)' -> '$($_.ImportUrl)'" }
        $importInstruction.UserMappings = [Tridion.ContentManager.ImportExport.Packaging.Mapping[]]($mappings)
    }

    $importExportClient = Get-ImportExportServiceClient
    $processId = $importExportClient.StartImport($uploadId, ($importInstruction))
    $state = Wait-ImportExportFinish $importExportClient $processId
    Write-Host $state

    # Download log and output it
    $importLogFullPath = "$($tempFolder)$($filename)-import.log"
    Invoke-DownloadLog $processId $importLogFullPath
    Get-Content $importLogFullPath

    if ($state -ne "Finished")
    {
        throw "An error occured while importing '$packageFullPath'"
    }

    #NOTE: workaround for CRQ-8103 - run import twice (non-transaction and in transaction)
    $processInfo = $importExportClient.GetProcessInfo($processId)
    $failedItems = [System.Collections.Generic.List[System.String]]$processInfo.ProcessSummary.FailedItems
    $importExportClient.Dispose()
    if ($failedItems.Count -gt 0)
    {
        if ($failedItems.Contains("/webdav/401%20Automated%20Test%20Parent/Home/Regression/Taxonomy/002%20Navigation%20Taxonomy%20Test%20Page%201.tpg"))
        {
            Import-CmPackage $importPackageFullPath $tempFolder $detailedMapping
        }
    }
}

#Include functions from ContentManagerUtils.ps1
$importExportFolder = Join-Path $PSScriptRoot "..\..\ImportExport"
. (Join-Path $importExportFolder "ContentManagerUtils.ps1")

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

# Modify cm_xm_usr.xsd to relax rules for Filename
& (Join-Path $PSScriptRoot 'modify-cm-xml-usr.ps1')
Write-Host "Modifying cm_xm_usr.xsd has been finished. Control has been given back"

#Process 'WhatIf' and 'Confirm' options
if (!($pscmdlet.ShouldProcess($cmsUrl, "Import DXA Test Module"))) { return }

$distSource = Join-Path (Split-Path $MyInvocation.MyCommand.Path) "\"
$distSource = $distSource.TrimEnd("\") + "\"
$tempFolder = Get-TempFolder "DXA"
$cmsUrl = $cmsUrl.TrimEnd("/") + "/"

$importPackageFullPath = Join-Path $distSource "module-Test.zip"
Write-Verbose "Import Package FullPath is '$importPackageFullPath'"

$permissionsFullPath = Join-Path $distSource "permissions.xml"
Write-Verbose "Permissions file FullPath is '$permissionsFullPath'"

Initialize-ImportExport $importExportFolder $tempFolder

# Create core service client and default read options
$coreServiceClient = Get-CoreServiceClient "Service"
$defaultReadOptions = New-Object Tridion.ContentManager.CoreService.Client.ReadOptions

$detailedMapping = Get-ImportMappings $masterPublication $siteTypePublication $contentPublication $sitePublication $rootFolder $rootStructureGroup

Import-CmPackageNonTransaction $importPackageFullPath $tempFolder $detailedMapping

#NOTE: workaround for CRQ-5672 - Save CEX appdata on Target Groups after import
$ceFolder = $distSource -replace "Test", "ContextExpressions"
Write-Host "Adding Context Expressions app data on imported target groups..."

Invoke-Expression "$ceFolder\set-context-expression.ps1 -cmsUrl $cmsUrl -targetGroupId '/webdav/100 Master/Building Blocks/cx.isAndroid.ttg' -contextExpression 'os.model == ''Android'''"
Invoke-Expression "$ceFolder\set-context-expression.ps1 -cmsUrl $cmsUrl -targetGroupId '/webdav/100 Master/Building Blocks/cx.isApple.ttg' -contextExpression 'device.vendor == ''Apple'''"
Invoke-Expression "$ceFolder\set-context-expression.ps1 -cmsUrl $cmsUrl -targetGroupId '/webdav/100 Master/Building Blocks/cx.isChrome.ttg' -contextExpression 'browser.model == ''Chrome'''"
Invoke-Expression "$ceFolder\set-context-expression.ps1 -cmsUrl $cmsUrl -targetGroupId '/webdav/100 Master/Building Blocks/cx.isMobile.ttg' -contextExpression 'device.mobile == ''true'''"

Write-Host "Adding Topology Manager Mappings for imported publications..."
$publicationUrls = @{
    "401 Automated Test Parent" = "autotest-parent";
    "500 Automated Test Child" = "autotest-child";
    "500 Automated Test Parent (Legacy)" = "autotest-parent-legacy";
    "500 Example Site (Legacy)" = "example-legacy";
    "600 Automated Test Child (Legacy)" = "autotest-child-legacy"}

$dxaWebAppIds = Get-TtmWebApplication | Where { $_.ScopedRepositoryKeys -contains "DxaSiteType" } | Select -ExpandProperty Id

$filter = New-Object Tridion.ContentManager.CoreService.Client.PublicationsFilterData
$publications = $coreServiceClient.GetSystemWideList($filter)

foreach ($url in $publicationUrls.GetEnumerator()) {
    $found = $false
    foreach ($pub in $publications)
    {
        if ($pub.Title -eq $url.Name)
        {
            $found = $true
            Write-Host "Found publication $($url.Name) with id $($pub.Id)"
            $dxaWebAppIds | ForEach-Object {
                    $dxaWebAppId = $_
                    Write-Host $dxaWebAppId
                    `Add-TtmMapping -WebApplicationId $dxaWebAppId -PublicationId $pub.Id -RelativeUrl $url.Value
                    }
        }
    }
    if (-Not $found)
    {
        Write-Host "Publication '$($url.Name)' does not exist"
    }
}

$coreServiceClient.Dispose()
