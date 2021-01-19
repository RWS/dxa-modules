<#
.SYNOPSIS
   Configures the Search Index used by the DXA Search Module in Topology Manager
.EXAMPLE
   .\ttm-configure.ps1 -cdEnvironmentId ExampleStagingEnvironment -searchQueryUrl http://cdserver:8080/solr/staging
#>

[CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$false)]
param (
    # The Topology Manager Identifier of the CD Environment to configure
    [Parameter(Mandatory=$true, HelpMessage="The Topology Manager Identifier of the CD Environment to configure")]
    [string]$cdEnvironmentId,

    # The Query URL of the Search Index used for the given CD Environment
    [Parameter(Mandatory=$true, HelpMessage="The Query URL of the Search Index used for the given CD Environment")]
    [string]$searchQueryUrl
)

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

$uri = $searchQueryUrl -as [System.URI]  
if (!$uri.AbsoluteURI -or !($uri.Scheme -match 'http|https'))
{
    throw "'$searchQueryUrl' is not a valid URL."
}  

#Process 'WhatIf' and 'Confirm' options
if (!($pscmdlet.ShouldProcess($cdEnvironmentId, "Configure DXA Search Module"))) { return }

$dxaSearchQueryUrlExtensionPropertyName = "DXA.Search.QueryURL"

$cdEnvironment = Get-TtmCdEnvironment $cdEnvironmentId

$dxaSearchQueryUrlExtensionProperty = $cdEnvironment.ExtensionProperties | Where { $_.Name -eq $dxaSearchQueryUrlExtensionPropertyName }
if ($dxaSearchQueryUrlExtensionProperty)
{
    # Extension Property already exists; change it.
    $dxaSearchQueryUrlExtensionProperty.Value = $searchQueryUrl
}
else
{
    # Extension Property didn't exist yet; add it.
    $dxaSearchQueryUrlExtensionProperty = New-Object Tridion.TopologyManager.Client.ExtensionProperty
    $dxaSearchQueryUrlExtensionProperty.Name = $dxaSearchQueryUrlExtensionPropertyName
    $dxaSearchQueryUrlExtensionProperty.Value = $searchQueryUrl
    $cdEnvironment.ExtensionProperties.Add($dxaSearchQueryUrlExtensionProperty)
}

Set-TtmCdEnvironment -Data $cdEnvironment