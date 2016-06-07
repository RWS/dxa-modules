<#
.SYNOPSIS
   Utility functions for DXA.NET Web Application deployment and configuration
.DESCRIPTION
This script is intended to be included ("dot-sourced") in another PowerShell script
#>


function Add-ModelBuilder($modelBuilderType, $configDoc) 
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
		$modelBuilderPipelineElement.AppendChild($modelBuilderElement) | Out-Null
		Write-Host "Added Model Builder '$modelBuilderType'."
    }
}

function Add-UnityDeclaration($type, $name, $configDoc) {
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
	}
}

function Set-UnityTypeMapping($type, $mapTo, $configDoc) {
	$mainContainer = $configDoc.unity.containers.container | ? {$_.name -eq "main"}
	if (!$mainContainer) 
	{
        throw "Main container not found."
    }

	$typeElement = $mainContainer.types.type | ? {$_.type -eq $type}
	if (!$typeElement)
	{
		$typeElement = $configDoc.CreateElement("type")
		$mainContainer.types.AppendChild($typeElement) | Out-Null
	}

	$typeElement.SetAttribute("type",$type)
	$typeElement.SetAttribute("mapTo",$mapTo)

    Write-Host "Set type mapping: '$type' -> '$mapTo'"
}
