<#
.SYNOPSIS
   Deploys the DXA Experience Optimization Module in a DXA .NET Web Application
.EXAMPLE
   .\web-install.ps1 -distDestination "c:\inetpub\wwwroot\mysite"
#>

[CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$false)]
Param(
    #The file system path of the root folder of your DXA Web Application
    [Parameter(Mandatory=$true, HelpMessage="The file system path of the root folder of your DXA Web Application")]
    [string]$distDestination,

    # Path of the Experience Optimization (client) log file
    [Parameter(Mandatory=$false)]
    [string]$logPath = "C:\Temp\logs\xo_client.log",

    # The log level for the Experience Optimization (client) log file
    [Parameter(Mandatory=$false)]
    [ValidateSet("Error", "Warning", "Information", "Verbose")]
    [string]$logLevel = "Warning"

)

# Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

#Include functions from DxaDeployUtils.ps1
$PSScriptDir = Split-Path $MyInvocation.MyCommand.Path
. (Join-Path $PSScriptDir "..\DxaDeployUtils.ps1")

# Process 'WhatIf' and 'Confirm' options
if (!($pscmdlet.ShouldProcess($distDestination, "Deploy the DXA Experience Optimization Module for SDL Web 8"))) { return }

# Initialization
$distSource = Split-Path $MyInvocation.MyCommand.Path
$distSource = $distSource.TrimEnd("\")
$distDestination = $distDestination.TrimEnd("\")

Write-Host "Copying files to '$distDestination' ..."
Copy-Item $distSource\web\* $distDestination -Recurse -Force
Copy-Item $distSource\web-ref\* $distDestination\bin -Recurse -Force

# Update Web.config
function Add-ExperimentTrackingHandler($configDoc)
{
    $experimentTrackingHandlerName = "ExperimentTrackingHandler"

    $handlersElement = $configDoc.SelectSingleNode("/configuration/system.webServer/handlers")
    $experimentTrackingHandlerElement = $handlersElement.SelectSingleNode("add[@name='$experimentTrackingHandlerName']")
    if ($experimentTrackingHandlerElement)
    {
        Write-Host "'$experimentTrackingHandlerName' handler is already configured."    
    }
    else
    {
        $experimentTrackingHandlerElement = $configDoc.CreateElement("add")
        $experimentTrackingHandlerElement.SetAttribute("name", "$experimentTrackingHandlerName")
        $experimentTrackingHandlerElement.SetAttribute("type", "Tridion.SmartTarget.Analytics.TrackingRedirect")
        $experimentTrackingHandlerElement.SetAttribute("path", "/redirect/*")
        $experimentTrackingHandlerElement.SetAttribute("verb", "*")
        $experimentTrackingHandlerElement.SetAttribute("resourceType", "Unspecified")
        $handlersElement.AppendChild($experimentTrackingHandlerElement) | Out-Null
        Write-Host "Added '$experimentTrackingHandlerName' handler."    
    }
}

function Add-ExperienceOptimizationLogger($configDoc, $logPath, $logLevel)
{
    $logSourceName = "ExperienceOptimizationLogger"
    $listenerName = "ExperienceOptimizationTraceListener"

    $configRoot = $configDoc.configuration
    $systemDiagnosticsElement = $configRoot.SelectSingleNode("system.diagnostics")
    if (!$systemDiagnosticsElement)
    {
        $systemDiagnosticsElement = $configDoc.CreateElement("system.diagnostics")
        $configRoot.AppendChild($systemDiagnosticsElement) | Out-Null
    }

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
        $listenerXml = [xml] "<add name='' initializeData='' rollSizeKb='102400' timestampPattern='yyyy-MM-dd' rollFileExistsBehavior='Increment' rollInterval='Midnight' maxArchivedFiles='0' type='Sdl.Web.Experience.Logging.TraceListeners.RollingFlatFileTraceListener, Sdl.Web.Experience' />"
        $listenerElement = $configDoc.ImportNode($listenerXml.DocumentElement, $true)
        $listenerElement.SetAttribute("name", $listenerName)
        $listenerElement.SetAttribute("initializeData", $logPath)
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


Write-Host "Updating Web.config ..."
[xml] $webConfigDoc = Get-Content "$distDestination\Web.config"
Enable-AmbientFrameworkModule $webConfigDoc
Add-ExperimentTrackingHandler $webConfigDoc
Add-IgnoreUrl "redirect" $webConfigDoc
Add-ModelBuilder "Sdl.Web.Modules.SmartTarget.Mapping.SmartTargetModelBuilder, Sdl.Web.Modules.SmartTarget" $webConfigDoc
Add-ExperienceOptimizationLogger $webConfigDoc $logPath $logLevel
$webConfigDoc.Save("$distDestination\Web.config")
