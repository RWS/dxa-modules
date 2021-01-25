<#
.SYNOPSIS
   Utility functions for DXA.NET Web Application deployment and configuration
.DESCRIPTION
This script is intended to be included ("dot-sourced") in another PowerShell script
#>


function Add-ModelBuilder([string] $modelBuilderType, [xml] $configDoc, [Boolean]$onTop)
{
    $modelBuilderPipelineElement = $configDoc.configuration.modelBuilderPipeline
    $modelBuilderElement = $modelBuilderPipelineElement.SelectSingleNode("add[@type='$modelBuilderType']")

	if ($modelBuilderElement)
	{
		Write-Host "Model Builder '$modelBuilderType' is already configured."
	}
	else
	{ 
        $modelBuilderElement = $configDoc.CreateElement("add")
		$modelBuilderElement.SetAttribute("type", $modelBuilderType)
        if($onTop) {
            $modelBuilderPipelineElement.InsertBefore($modelBuilderElement, $modelBuilderPipelineElement.FirstChild
            ) | Out-Null
        } else {
            $modelBuilderPipelineElement.AppendChild($modelBuilderElement) | Out-Null
        }

		Write-Host "Added Model Builder '$modelBuilderType'"
    }
}

function Add-UnityDeclaration([string] $type, [string] $name, [xml] $configDoc) 
{
	$existing = $configDoc.SelectSingleNode("/unity/*[local-name()='" + $type + "' and @name='" + $name + "']")
	if ($existing)
	{
		Write-Host "$type '$name' is already defined."
	}
	else
	{
		$aliases = $configDoc.unity.typeAliases
		$item = $configDoc.CreateElement($type)
		$item.SetAttribute("name",$name)
		$configDoc.unity.InsertBefore($item, $aliases) | Out-Null
        Write-Host "Added declaration for $type '$name'"
	}
}

function Set-UnityTypeMapping([string] $type, [string] $mapTo, [xml] $configDoc) 
{
	$mainContainer = $configDoc.unity.containers.container | ? {$_.name -eq "main"}
	if (!$mainContainer) 
	{
        throw "Main container not found."
    }

	$typeElement = $mainContainer.types.type | ? {$_.type -eq $type}
	if ($typeElement)
    {
        Write-Host "Found existing type mapping: '$type' -> '$($typeElement.mapTo)'"
    }
    else
	{
		$typeElement = $configDoc.CreateElement("type")
		$mainContainer.types.AppendChild($typeElement) | Out-Null
	}

	$typeElement.SetAttribute("type",$type)
	$typeElement.SetAttribute("mapTo",$mapTo)

    Write-Host "Set type mapping: '$type' -> '$mapTo'"
}


function Get-XmlElement([string] $xpath, [xml] $configDoc)
{
    $node = $configDoc.SelectSingleNode($xpath)
    if (!$node)
    {
        $parts = $xpath.Split("/", [System.StringSplitOptions]::RemoveEmptyEntries)
        $xpath = ""        
        $parent = $configDoc
        foreach ($part in $parts)
        {
            $xpath += "/$part"
            $node = $configDoc.SelectSingleNode($xpath)
            if (!$node)
            {
                $node = $configDoc.CreateElement($part -replace '\[.*\]') # Strip off XPath predicate (if any)
                $parent.AppendChild($node) | Out-Null
            }
            $parent = $node
        }        
    }
    return $node
}

function Enable-AmbientFrameworkModule([xml] $conficDoc)
{
    # Ensure the AmbientFrameworkModule is enabled; we remove it on a Live deployment.
    $adfModuleName = "AmbientFrameworkModule"

    $modulesElement = $conficDoc.SelectSingleNode("/configuration/system.webServer/modules")
    $adfModuleElement = $modulesElement.SelectSingleNode("add[@name='$adfModuleName']")
    if ($adfModuleElement)
    {
        Write-Host "'$adfModuleName' module is already enabled."    
    }
    else
    {
        $adfModuleElement = $conficDoc.CreateElement("add")
        $adfModuleElement.SetAttribute("name", "$adfModuleName")
        $adfModuleElement.SetAttribute("type", "Tridion.ContentDelivery.AmbientData.HttpModule")
        $adfModuleElement.SetAttribute("preCondition", "managedHandler")
        $modulesElement.AppendChild($adfModuleElement) | Out-Null
        Write-Host "Enabled '$adfModuleName' module."    
    }
}

function Add-IgnoreUrl([string] $ignoreUrl, [xml] $configDoc)
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

function Add-CdAmbientClaim([string] $claimUri, [string] $containerXpath, [xml] $configDoc)
{
    $claimElement = Get-XmlElement "$containerXpath/Claim[@Uri='$claimUri']" $configDoc
    if ($claimElement.Uri -eq $claimUri)
    {
        Write-Host "Claim '$claimUri' is already defined."
    }
    else
    {
        $claimElement.SetAttribute("Uri", $claimUri)
        Write-Host "Added Claim '$claimUri'."
    }
}

function Add-CdAmbientCartridge([string] $file, [xml] $configDoc)
{
    $cartridgeElement = Get-XmlElement "/Configuration/Cartridges/Cartridge[@File='$file']" $configDoc
    if ($cartridgeElement.File -eq $file)
    {
        Write-Host "Cartridge '$file' is already defined."
    }
    else
    {
        $cartridgeElement.SetAttribute("File", $file)
        Write-Host "Added Cartridge '$file'."
    }
}

function Add-CdStorageBundle([string] $src, [xml] $configDoc)
{
    $bundleElement = Get-XmlElement "/Configuration/Global/Storages/StorageBindings/Bundle[@src='$src']" $configDoc
    if ($bundleElement.src -eq $src)
    {
        Write-Host "Bundle '$src' is already defined."
    }
    else
    {
        $bundleElement.SetAttribute("src", $src)
        Write-Host "Added Bundle '$src'."
    }
}

function Set-AppSetting([string]$key, [string]$value, [xml] $configDoc)
{
    $appSettingsNode = Get-XmlElement "/configuration/appSettings" $configDoc

    $appSettingNode = $appSettingsNode.SelectSingleNode("add[@key='$key']")
    if (!$appSettingNode) 
    {
        $appSettingNode = $configDoc.CreateElement("add")
        $appSettingNode.SetAttribute("key", "$key")
        $dummy = $appSettingsNode.AppendChild($appSettingNode)
    }
    $appSettingNode.SetAttribute("value", $value)
    Write-Host "Set app setting '$key' to '$value'"
}
