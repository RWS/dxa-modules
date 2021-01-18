<#
.SYNOPSIS
   Deploys the DXA 51Degrees Module in a DXA .NET Web Application
.EXAMPLE
   .\web-install.ps1 -distDestination "c:\inetpub\wwwroot\mysite" -dataset "~/App_Data/51Degrees.dat"
#>

[CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$false)]
Param(
    #The file system path of the root folder of your DXA Web Application
    [Parameter(Mandatory=$true, HelpMessage="The file system path of the root folder of your DXA Web Application")]
    [string]$distDestination,

    # File system path of the data set file for device detection
    [Parameter(Mandatory=$false, HelpMessage="File system path of the data set file for device detection")]
    [string]$datasetPath = "~/App_Data/51Degrees.dat"
)

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

#Include functions from DxaDeployUtils.ps1
$PSScriptDir = Split-Path $MyInvocation.MyCommand.Path
. (Join-Path $PSScriptDir "..\DxaDeployUtils.ps1")

#Process 'WhatIf' and 'Confirm' options
if (!($pscmdlet.ShouldProcess($distDestination, "Deploy the DXA 51Degrees Module"))) { return }

function Update-WebConfig([string]$binaryPath, [bool]$update, $config)
{
	$fiftyOneSectionGroupElement = Get-XmlElement "/configuration/configSections/sectionGroup[@name='fiftyOne']" $config
	if(!$fiftyOneSectionGroupElement.HasAttribute("name"))
	{
		$fiftyOneSectionGroupElement.SetAttribute("name", "fiftyOne");
		$fiftyOneSectionGroupElement.SetAttribute("type", "System.Configuration.ApplicationSettingsGroup");
		$fiftyOneSectionDeclElement = $config.CreateElement("section");
		$fiftyOneSectionDeclElement.SetAttribute("name", "detection");
		$fiftyOneSectionDeclElement.SetAttribute("type", "FiftyOne.Foundation.Mobile.Detection.Configuration.DetectionSection, FiftyOne.Foundation");
		$fiftyOneSectionDeclElement.SetAttribute("requirePermission", "false");
		$fiftyOneSectionDeclElement.SetAttribute("allowDefinition", "Everywhere");
		$fiftyOneSectionDeclElement.SetAttribute("restartOnExternalChanges","false"); 
		$fiftyOneSectionDeclElement.SetAttribute("allowExeDefinition", "MachineToApplication");
		$fiftyOneSectionGroupElement.AppendChild($fiftyOneSectionDeclElement) | Out-Null
	}	
	$fiftyOneSectionElement = Get-XmlElement "/configuration/fiftyOne/detection" $config
	$fiftyOneSectionElement.SetAttribute("enabled", "True");		
    $fiftyOneSectionElement.SetAttribute("autoUpdate", "$update");      
    $fiftyOneSectionElement.SetAttribute("binaryFilePath", "$binaryPath");        
}

# Begin install steps
$distSource = (Resolve-Path (Join-Path (Split-Path $MyInvocation.MyCommand.Path) "web\")).Path
$distSource = $distSource.TrimEnd("\")
$distDestination = $distDestination.TrimEnd("\")

Write-Host "Copying files to '$distDestination' ..."
Copy-Item $distSource\* $distDestination -Recurse -Force

# Update Unity.config
$unityConfigFile = "$distDestination\Unity.config"
Write-Host "Updating '$unityConfigFile' ..."
[xml]$unityConfigDoc = Get-Content $unityConfigFile
Add-UnityDeclaration "assembly" "Sdl.Web.Modules.Degrees51" $unityConfigDoc
Add-UnityDeclaration "namespace" "Sdl.Web.Modules.Degrees51" $unityConfigDoc
Set-UnityTypeMapping "IContextClaimsProvider" "Degrees51ContextClaimsProvider" $unityConfigDoc
$unityConfigDoc.Save("$unityConfigFile")

# Update Web.config
$webConfigFile = "$distDestination\Web.config"
Write-Host "Updating '$webConfigFile' ..."
[xml]$webConfigDoc = Get-Content $webConfigFile
Update-WebConfig $datasetPath $True $webConfigDoc
$webConfigDoc.Save("$webConfigFile")