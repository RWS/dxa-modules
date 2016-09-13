<#
.SYNOPSIS
   Performs Audience Manager Module deployment actions for Continuous Integration environment
#>

[CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$false)]
Param(
    #The file system path of the root folder of your DXA Web Application
    [Parameter(Mandatory=$true, HelpMessage="The file system path of the root folder of your DXA Web Application")]
    [string]$distDestination,

    # Path of the Audience Manager (client) log file
    [Parameter(Mandatory=$false)]
    [string]$logPath = "C:\Temp\logs\am_client.log",

    # The log level for the Audience Manager (client) log file
    [Parameter(Mandatory=$false)]
    [ValidateSet("Error", "Warning", "Information", "Verbose")]
    [string]$logLevel = "Warning"
)

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

#Include functions from DxaDeployUtils.ps1
$PSScriptDir = Split-Path $MyInvocation.MyCommand.Path
. (Join-Path $PSScriptDir "..\DxaDeployUtils.ps1")

$distSource = $PSScriptDir
$distSource = $distSource.TrimEnd("\")
$distDestination = $distDestination.TrimEnd("\")


function Set-MembershipProvider([string] $providerName, [string] $providerType, [xml] $configDoc)
{
    $membershipProvidersElement = Get-XmlElement "/configuration/system.web/membership/providers" $configDoc
    if (!$membershipProvidersElement.HasChildNodes)
    {
        $clearElement = $configDoc.CreateElement("clear")
        $membershipProvidersElement.AppendChild($clearElement) | Out-Null
    }
    $membershipProviderElement = $membershipProvidersElement.SelectSingleNode("add[@name='$providerName']")
    if ($membershipProviderElement)
    {
        Write-Host "Membership Provider '$providerName' is already configured"
    }
    else
    {
        $membershipProviderElement = $configDoc.CreateElement("add")
        $membershipProviderElement.SetAttribute("name", $providerName)
        $membershipProviderElement.SetAttribute("type", $providerType)
        $membershipProvidersElement.AppendChild($membershipProviderElement) | Out-Null

        Write-Host "Added '$providerName' Membership Provider."
    }
}

function Add-SystemDiagnosticsLogger([string] $logSourceName, [string] $listenerName, [string] $listenerType, [string] $logPath, [string] $logLevel, [xml] $configDoc)
{
    $systemDiagnosticsElement = Get-XmlElement "/configuration/system.diagnostics" $configDoc

    $sourcesElement = $systemDiagnosticsElement.SelectSingleNode("sources")
    if (!$sourcesElement)
    {
        $sourcesElement = $configDoc.CreateElement("sources")
        $systemDiagnosticsElement.AppendChild($sourcesElement) | Out-Null
    }

    $sourceElement = $sourcesElement.SelectSingleNode("source[@name='$logSourceName']")
    if ($sourceElement)
    {
        Write-Host "Log source '$logSourceName' is already configured."
    }
    else
    {
        $sourceXml = [xml] "<source name='$logSourceName' switchName='sourceSwitch'><listeners><add name='$listenerName'/></listeners></source>"
        $sourceElement = $configDoc.ImportNode($sourceXml.DocumentElement, $true)
        $sourcesElement.AppendChild($sourceElement) | Out-Null
        Write-Host "Added log source '$logSourceName'."
    }

    $sharedListenersElement = $systemDiagnosticsElement.SelectSingleNode("sharedListeners")
    if (!$sharedListenersElement)
    {
        $sharedListenersElement = $configDoc.CreateElement("sharedListeners")
        $systemDiagnosticsElement.AppendChild($sharedListenersElement) | Out-Null
    }

    $listenerElement = $sharedListenersElement.SelectSingleNode("add[@name='$listenerName']")
    if (!$listenerElement)
    {
        $listenerXml = [xml] "<add name='$listenerName' initializeData='$logPath' rollSizeKb='102400' timestampPattern='yyyy-MM-dd' rollFileExistsBehavior='Increment' rollInterval='Midnight' maxArchivedFiles='0' type='$listenerType' />"
        $listenerElement = $configDoc.ImportNode($listenerXml.DocumentElement, $true)
        $sharedListenersElement.AppendChild($listenerElement) | Out-Null
        Write-Host "Added trace listener '$listenerName'"

    }

    $switchesElement = $systemDiagnosticsElement.switches
    if (!$switchesElement)
    {
        $switchesElement = $configDoc.CreateElement("switches")
        $systemDiagnosticsElement.AppendChild($switchesElement) | Out-Null
    }

    $switchElement = $switchesElement.SelectSingleNode("add[@name='sourceSwitch']")
    if (!$switchElement)
    {
        $switchElement = $configDoc.CreateElement("add")
        $switchElement.SetAttribute("name", "sourceSwitch")
        $switchesElement.AppendChild($switchElement) | Out-Null
    }
    $switchElement.SetAttribute("value", $logLevel)
    Write-Host "Set log level to '$logLevel'."
}

$webConfigFile = "$distDestination\Web.config"
Write-Host "Updating '$webConfigFile' ..."
[xml] $webConfigDoc = Get-Content $webConfigFile
Set-MembershipProvider "AudienceManagerMembership" "Sdl.Web.Modules.AudienceManager.Security.AudienceManagerMembershipProvider, Sdl.Web.Modules.AudienceManager" $webConfigDoc
Add-SystemDiagnosticsLogger "AudienceManagerLogger" "AudienceManagerTraceListener" "Sdl.AudienceManager.ContentDelivery.Logging.TraceListeners.RollingFlatFileTraceListener, Sdl.AudienceManager.ContentDelivery" $logPath $logLevel $webConfigDoc
$webConfigDoc.Save($webConfigFile)
