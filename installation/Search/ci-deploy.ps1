<#
.SYNOPSIS
   Performs Search module deployment actions for Continuous Integration environment
#>

[CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$false)]
Param(
    [Parameter(Mandatory=$true, HelpMessage="File system path of the root folder of DXA Website")]
    [string]$distDestination,
    [Parameter(Mandatory=$false, HelpMessage="The type name of the Search Provider to use. Can be 'SolrProvider' or 'AwsCloudSearchProvider'.")]
    [ValidateSet("SolrProvider", "AwsCloudSearchProvider")]
    $searchProviderType = "SolrProvider"
)

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
AddAssemblyOrNamespaceToUnityConfig "namespace" "Sdl.Web.Modules.Search.Providers"
AddTypeToUnityConfig "ISearchProvider" "SolrProvider"

Write-Output ("Updated 'Unity.config' file for Search module")
