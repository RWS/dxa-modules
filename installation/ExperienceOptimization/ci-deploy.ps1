<#
.SYNOPSIS
   Performs Smart Target module deployment actions for Continuous Integration environment
#>

[CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$false)]
Param(
    [Parameter(Mandatory=$true, HelpMessage="File system path of the root folder of DXA Website")]
    [string]$distDestination,

    # Path of the Experience Optimization (client) log file
    [Parameter(Mandatory=$false)]
    [string]$logPath = "C:\Temp\logs\xo_client.log",

    # The log level for the Experience Optimization (client) log file
    [Parameter(Mandatory=$false)]
    [ValidateSet("Error", "Warning", "Information", "Verbose")]
    [string]$logLevel = "Warning"
)

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

#Include functions from DxaDeployUtil.ps1
$PSScriptDir = Split-Path $MyInvocation.MyCommand.Path
. (Join-Path $PSScriptDir "..\DxaDeployUtils.ps1")

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

function Add-IgnoreUrl($ignoreUrl, $configDoc)
{
    $ignoreUrlsKey = "ignore-urls"

    $appSettingsElement = $configDoc.configuration.appSettings
    $ignoreUrlsElement = $appSettingsElement.SelectSingleNode("add[@key='$ignoreUrlsKey']")
    if ($ignoreUrlsElement)
    {
        $ignoreUrls = $ignoreUrlsElement.GetAttribute("value")
        if (($ignoreUrls -contains $ignoreUrl))
        {
            Write-Host "'$ignoreUrlsKey' app setting already contains '$ignoreUrl'."
        }
        else
        {
            $ignoreUrls += ";$ignoreUrl"
            Write-Host "Set '$ignoreUrlsKey' app setting to '$ignoreUrls'."
        }
    }
    else
    {
        $ignoreUrlsElement = $configDoc.CreateElement("add")
        $ignoreUrlsElement.SetAttribute("key", "$ignoreUrlsKey")
        $ignoreUrlsElement.SetAttribute("value", $ignoreUrl)
        $appSettingsElement.AppendChild($ignoreUrlsElement) | Out-Null
        Write-Host "Added '$ignoreUrlsKey' app setting with value '$ignoreUrl'."
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
Add-IgnoreUrl "redirect" $webConfigDoc
Add-ExperimentTrackingHandler $webConfigDoc
Add-ModelBuilder "Sdl.Web.Modules.SmartTarget.Mapping.SmartTargetModelBuilder, Sdl.Web.Modules.SmartTarget" $webConfigDoc
Add-ExperienceOptimizationLogger $webConfigDoc $logPath $logLevel
$webConfigDoc.Save("$distDestination\Web.config")
