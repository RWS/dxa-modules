<#
.Synopsis
   Deploys Search module to web application
.DESCRIPTION
   Deploys Search module to web application
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
if (!($pscmdlet.ShouldProcess("System", "Deploy Search module in web application"))) { return }

#Initialization
$IsInteractiveMode = !((gwmi -Class Win32_Process -Filter "ProcessID=$PID").commandline -match "-NonInteractive") -and !$NonInteractive

$distSource = (Resolve-Path (Join-Path (Split-Path $MyInvocation.MyCommand.Path) "web\")).Path

#Format data
$distSource = $distSource.TrimEnd("\")
$distDestination = $distDestination.TrimEnd("\")

#Copy files
Copy-Item $distSource\* $distDestination -Recurse -Force
Write-Output ("Copied views and DLLs for Search module")

##Unity.config
function AddAssemblyOrNamespaceToUnityConfig ($type, $name) {
	[xml]$config = Get-Content $distDestination\Unity.config -ErrorAction Stop
	$existing = $config.SelectSingleNode("/unity/*[local-name()='" + $type + "' and @name='" + $name + "']")
	if ($existing -ne $null)
	{
		Write-Output ("Unity.config already contains " + $type + " : " + $name)
	}
	else
	{
		$aliases = $config.unity.typeAliases
		$item = $config.CreateElement($type)
		$item.SetAttribute("name",$name)
		$config.unity.InsertBefore($item, $aliases)
		$config.Save("$distDestination\Unity.config")
	}
}

function AddTypeToUnityConfig ($type, $mapTo) {
	[xml]$config = Get-Content $distDestination\Unity.config -ErrorAction Stop
	$mainContainer = $config.unity.containers.container | ?{$_.name -eq "main"}
	if ($mainContainer -ne $null) 
	{
		$existing = $mainContainer.types.type | ?{$_.type -eq $type}
		if ($existing -ne $null)
		{
			Write-Output ("Unity.config already contains type: " + $type)
		}
		else
		{
			$item = $config.CreateElement("type")
			$item.SetAttribute("type",$type)
			$item.SetAttribute("mapTo",$mapTo)
			$mainContainer.types.AppendChild($item)
			$config.Save("$distDestination\Unity.config")
		}
	}
}


AddAssemblyOrNamespaceToUnityConfig "assembly" "Sdl.Web.Modules.Search"
AddAssemblyOrNamespaceToUnityConfig "namespace" "Sdl.Web.Modules.Search"
AddAssemblyOrNamespaceToUnityConfig "namespace" "Sdl.Web.Modules.Search.Solr"
AddTypeToUnityConfig "ISearchProvider" "SolrProvider"

Write-Output ("Updated 'Unity.config' file for Search module")
