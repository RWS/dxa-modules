<#
.SYNOPSIS
   Deploys the Search Module's indexer to a deployer web application in IIS
.EXAMPLE
   & '.\deployer-install.ps1' -deployerRootFolder "c:\inetpub\wwwroot\mysite" -indexerUrl "http://localhost:8080/solr/staging"
.INPUTS
   deployerRootFolder, searchIndexerType, indexerUrl
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
if (!($pscmdlet.ShouldProcess("System", "Deploy Search module in deployer application"))) { return }

#Initialization
$IsInteractiveMode = !((gwmi -Class Win32_Process -Filter "ProcessID=$PID").commandline -match "-NonInteractive") -and !$NonInteractive

$distSource = (Resolve-Path (Join-Path (Split-Path $MyInvocation.MyCommand.Path) "deployer\")).Path
$distSource = $distSource.TrimEnd("\")

$deployerRootFolder = $deployerRootFolder.TrimEnd("\")

#Copy config file(s)
Copy-Item $distSource\config\* $deployerRootFolder\bin\config -Force

#Copy libs
Copy-Item $distSource\lib\si4t-$searchIndexerType\* $deployerRootFolder\bin\lib -Force

#Update cd_storage_conf.xml
[xml]$config = Get-Content $deployerRootFolder\bin\config\cd_storage_conf.xml -ErrorAction Stop

$storagesElement = $config.Configuration.Global.Storages
$storageBindingsElement = $storagesElement.SelectSingleNode("StorageBindings")
if ($storageBindingsElement -eq $null)
{
    $storageBindingsElement = $config.CreateElement("StorageBindings")
    $storagesElement.AppendChild($storageBindingsElement)

}
if ($storageBindingsElement.SelectSingleNode("Bundle[@src='SearchDAOBundle.xml']") -eq $null)
{
    $bundleElement = $config.CreateElement("Bundle")
    $bundleElement.SetAttribute("src", "SearchDAOBundle.xml")
    $storageBindingsElement.AppendChild($bundleElement)
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

   $storageElement.AppendChild($indexerElement)
}

$config.Save("$deployerRootFolder\bin\config\cd_storage_conf.xml")
