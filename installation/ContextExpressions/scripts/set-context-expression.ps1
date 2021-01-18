<#
.SYNOPSIS
   Sets a Context Expression on a Target Group
.EXAMPLE
   .\set-context-expression.ps1 -cmsUrl http://localhost -targetGroupId tcm:123-456-256 -contextExpression "browser.vendor == 'Google'"
#>

[CmdletBinding( SupportsShouldProcess=$false, PositionalBinding=$true)]
Param (
    # The URL of the CMS
    [Parameter(Mandatory=$true, Position=0, HelpMessage="The URL of the CMS")]
    [string]$cmsUrl,

    # The identifier (TCM URI or WebDAV URL) of the Target Group to set the Context Expression on
    [Parameter(Mandatory=$true, Position=1, HelpMessage="The identifier (TCM URI or WebDAV URL) of the Target Group to set the Context Expression on")]
    [string]$targetGroupId,

    # The JEXL Context Expression to set on the Target Group
    [Parameter(Mandatory=$true, Position=2, HelpMessage="The JEXL Context Expression to set on the Target Group")]
    [string]$contextExpression,

    # By default, the current Windows user's credentials are used, but it is possible to specify alternative credentials:
    [Parameter(Mandatory=$false, HelpMessage="CMS User name")]
    [string]$cmsUserName,
    [Parameter(Mandatory=$false, HelpMessage="CMS User password")]
    [string]$cmsUserPassword,
    [Parameter(Mandatory=$false, HelpMessage="CMS Authentication type")]
    [ValidateSet("Windows", "Basic")]
    [string]$cmsAuth = "Windows"
)

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

$cmsUrl = $cmsUrl.TrimEnd("/") + "/"

#Include functions from ContentManagerUtils.ps1
$PSScriptDir = Split-Path $MyInvocation.MyCommand.Path
$importExportFolder = Join-Path $PSScriptDir "..\..\ImportExport"
. (Join-Path $importExportFolder "ContentManagerUtils.ps1")

Initialize-CoreServiceClient $importExportFolder | Out-Null

$coreServiceClient = Get-CoreServiceClient "Service"

Add-Type -Path (Join-Path $PSScriptDir "Tridion.Extensions.ContextExpressions.Common.dll")

$targetGroupExtensionData = New-Object Tridion.Extensions.ContextExpressions.TargetGroupExtensionData
$targetGroupExtensionData.ContextExpression = $contextExpression

$appDataAdapter = New-Object Tridion.ContentManager.CoreService.Client.ApplicationDataAdapter "ce:TargetGroupExtension", $targetGroupExtensionData
$appData = $appDataAdapter.ApplicationData
Write-Output $appData

$coreServiceClient.SaveApplicationData($targetGroupId, $appData)
$coreServiceClient.Dispose()