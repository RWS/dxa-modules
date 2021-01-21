<#
.SYNOPSIS
   Installs the DXA Search Module's (SI4T) Indexer in the Deployer
.DESCRIPTION
    The Deployer should be a SDL Web 8 standalone Deployer Service
.EXAMPLE
   .\deployer-install.ps1 -deployerRootFolder "c:\inetpub\wwwroot\mysite" -indexerUrl "http://localhost:8080/solr/staging"
#>

[CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$false)]
Param(
    [Parameter(Mandatory=$true, HelpMessage="File system path of the root folder of the deployer web application")]
    [string]$deployerRootFolder,

    [Parameter(Mandatory=$false, HelpMessage="The type of Search Indexer to use. Can be 'Solr' or 'CloudSearch'.")]
    [ValidateSet("Solr", "CloudSearch")]
    [string]$searchIndexerType = "Solr",

    [Parameter(Mandatory=$true, HelpMessage="The URL of the indexer (Solr core or CloudSearch document endpoint).")]
    [string]$indexerUrl

)

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

#Process 'WhatIf' and 'Confirm' options
if (!($pscmdlet.ShouldProcess($deployerRootFolder, "Install $searchIndexerType Search indexer in Deployer"))) { return }

#Initialization
$extensionName = "si4t-$($searchIndexerType.ToLower())"

$distSource = (Resolve-Path (Join-Path (Split-Path $MyInvocation.MyCommand.Path) "deployer\")).Path
$distSource = $distSource.TrimEnd("\")
$deployerRootFolder = $deployerRootFolder.TrimEnd("\")
$deployerConfigFolder = "$deployerRootFolder\config"

$deployerServicesFolder = "$deployerRootFolder\services"

#Copy config file(s)
Copy-Item $distSource\config\* $deployerConfigFolder -Force -Verbose

#Copy libs
Copy-Item $distSource\lib\$extensionName\* $deployerServicesFolder\$extensionName-extension -Force -Verbose

#Update cd_storage_conf.xml
$cdStorageConfig = "$deployerConfigFolder\cd_storage_conf.xml"
Write-Host "Updating '$cdStorageConfig' ..."
[xml]$config = Get-Content "$cdStorageConfig"

$storagesElement = $config.Configuration.Global.Storages
$storageBindingsElement = $storagesElement.SelectSingleNode("StorageBindings")
if ($storageBindingsElement -eq $null)
{
    $storageBindingsElement = $config.CreateElement("StorageBindings")
    $dummy = $storagesElement.AppendChild($storageBindingsElement)
    Write-Host "Added element: $($storageBindingsElement.OuterXml)"
}
if ($storageBindingsElement.SelectSingleNode("Bundle[@src='SearchDAOBundle.xml']") -eq $null)
{
    $bundleElement = $config.CreateElement("Bundle")
    $bundleElement.SetAttribute("src", "SearchDAOBundle.xml")
    $dummy = $storageBindingsElement.AppendChild($bundleElement)
    Write-Host "Added element: $($bundleElement.OuterXml)"
}

Foreach ($storageElement in $config.SelectNodes("//Storage[@Type='persistence' and @Class='com.tridion.storage.persistence.JPADAOFactory']"))
{
   $storageElement.SetAttribute("Class", "com.tridion.storage.si4t.JPASearchDAOFactory")

   if ($searchIndexerType -eq "Solr")
   {
       $indexerElement = $config.CreateElement("Indexer")
       $indexerElement.SetAttribute("Class", "org.si4t.solr.SolrIndexer")
       $indexerElement.SetAttribute("DefaultCoreUrl", $indexerUrl)
       $indexerElement.SetAttribute("Mode", "http")
       $indexerElement.SetAttribute("DocExtensions", "pdf,docx,doc,xls,xlsx,pptx,ppt")
   }
   else
   {
       $indexerElement = $config.CreateElement("Indexer")
       $indexerElement.SetAttribute("Class", "org.si4t.cloudsearch.CloudSearchIndexer")
       $indexerElement.SetAttribute("documentEndpoint", $indexerUrl)
       $indexerElement.SetAttribute("authentication", "implicit")
       $indexerElement.SetAttribute("access_key_id", "")
       $indexerElement.SetAttribute("secret_access_key", "")
       $indexerElement.SetAttribute("indexBatchSize", "20")
       $indexerElement.SetAttribute("DocExtensions", "pdf,docx,doc,xls,xlsx,pptx,ppt")
   }

   $dummy = $storageElement.AppendChild($indexerElement)

   Write-Host "Changed element: $($storageElement.OuterXml)"
}

$config.Save("$cdStorageConfig")
