<#
.SYNOPSIS
   Sets the ContentType for TridionDocsMashup on a Publication
.EXAMPLE
   .\set-content-types.ps1 -cmsUrl http://localhost:81
#>

[CmdletBinding( SupportsShouldProcess=$false, PositionalBinding=$true)]
Param (
    # The URL of the CMS
    [Parameter(Mandatory=$true, Position=0, HelpMessage="The URL of the CMS")]
    [string]$cmsUrl,
	
    # Title of the Publication containing the DXA Master items
    [Parameter(Mandatory=$false, HelpMessage="Title of the Publication containing the DXA Master items")]
    [string]$masterPublication = "100 Master",
	
    # Title of the Site Type Publication
    [Parameter(Mandatory=$false, HelpMessage="Title of the Site Type Publication")]
    [string]$siteTypePublication = "110 DXA Site Type",
	
    # Title of the Root Folder
    [Parameter(Mandatory=$false, HelpMessage="Title of the Root Folder")]
    [string]$rootFolder = "Building Blocks",
	
    # By default, the current Windows user's credentials are used, but it is possible to specify alternative credentials:
    [Parameter(Mandatory=$false, HelpMessage="CMS User name")]
    [string]$cmsUserName,
    [Parameter(Mandatory=$false, HelpMessage="CMS User password")]
    [string]$cmsUserPassword,
    [Parameter(Mandatory=$false, HelpMessage="CMS Authentication type")]
    [ValidateSet("Windows", "Basic")]
    [string]$cmsAuth = "Windows"
)

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"
$applicationId = "SiteEdit"

$cmsUrl = $cmsUrl.TrimEnd("/") + "/"

#Include functions from ContentManagerUtils.ps1
$PSScriptDir = Split-Path $MyInvocation.MyCommand.Path
$importExportFolder = Join-Path $PSScriptDir "..\..\ImportExport"
. (Join-Path $importExportFolder "ContentManagerUtils.ps1")

Initialize-CoreServiceClient $importExportFolder | Out-Null

$coreServiceClient = Get-CoreServiceClient "Service"

#Get Ids to create the ContentType
$readOptions = New-Object "Tridion.ContentManager.CoreService.Client.ReadOptions"

$itemId = $coreServiceClient.Read("/webdav/$siteTypePublication", $readOptions).Id.ToString()

$componentId = $coreServiceClient.Read("/webdav/$siteTypePublication/$rootFolder/Modules Content/TridionDocsMashup/Content/_Cloneable Content/Tridion Docs Static Widget.xml", $readOptions).Id.ToString()
$componentTemplateId = $coreServiceClient.Read("/webdav/$masterPublication/$rootFolder/Modules/TridionDocsMashup/Editor/Templates/Tridion Docs Static Widget.tctcmp", $readOptions).Id.ToString()
$folderId = $coreServiceClient.Read("/webdav/$siteTypePublication/$rootFolder/Modules Content/TridionDocsMashup/Content/Tridion Docs", $readOptions).Id.ToString()
$pageTemplateId = $coreServiceClient.Read("/webdav/$siteTypePublication/$rootFolder/Modules/TridionDocsMashup/Editor/Templates/Bicycle Page With Static Region.tptcmp", $readOptions).Id.ToString()

$applicationData = $coreServiceClient.ReadApplicationData($itemId, $applicationId)
$content = [System.Text.Encoding]::UTF8.GetString($applicationData.Data)

# Some of the method calls are being casted to [void] to prevent from being printed to the output
[xml]$appDataXml = New-Object System.Xml.XmlDocument
[void]$appDataXml.LoadXml($content)

$ns = New-Object System.Xml.XmlNamespaceManager($appDataXml.NameTable)
$ns.AddNamespace("ns", $appDataXml.DocumentElement.NamespaceURI)
$ns.AddNamespace("xlink", "http://www.w3.org/1999/xlink")

$contentType = $appDataXml.SelectSingleNode('//ns:configuration/ns:Publication/ns:ContentTypes/ns:ContentType[@Title="Tridion Docs"]', $ns)

if (-not $contentType)
{
	Write-Host "Creating ContentType 'Tridion Docs'."

	$contentType = $appDataXml.CreateElement("ContentType", $appDataXml.configuration.NamespaceURI)
	[void]$contentType.SetAttribute("Title", "Tridion Docs")
	[void]$contentType.SetAttribute("InsertPosition", "bottom")
	[void]$contentType.SetAttribute("Description", "DXA Content Type for Tridion Docs Mashup.")

	$contentTitle = $appDataXml.CreateElement("ContentTitle", $appDataXml.configuration.NamespaceURI)
	[void]$contentTitle.SetAttribute("Type", "prompt")

	$component = $appDataXml.CreateElement("Component", $appDataXml.configuration.NamespaceURI)
	$xlink = $appDataXml.CreateAttribute("xlink", "href", $ns.LookupNamespace("xlink"))
	$xlink.Value = $componentId
	[void]$component.SetAttributeNode($xlink)

	$componentTemplate = $appDataXml.CreateElement("ComponentTemplate", $appDataXml.configuration.NamespaceURI)
	$xlink = $appDataXml.CreateAttribute("xlink", "href", $ns.LookupNamespace("xlink"))
	$xlink.Value = $componentTemplateId
	[void]$componentTemplate.SetAttributeNode($xlink)

	$folder = $appDataXml.CreateElement("Folder", $appDataXml.configuration.NamespaceURI)
	$xlink = $appDataXml.CreateAttribute("xlink", "href", $ns.LookupNamespace("xlink"))
	$xlink.Value = $folderId
	[void]$folder.SetAttributeNode($xlink)
	$folder.SetAttribute("CanChange", "no")

	[void]$contentType.AppendChild($contentTitle)
	[void]$contentType.AppendChild($component)
	[void]$contentType.AppendChild($componentTemplate)
	[void]$contentType.AppendChild($folder)

	[void]$appDataXml.configuration.Publication.ContentTypes.AppendChild($contentType)

	$pageTemplate = $appDataXml.SelectSingleNode('//ns:configuration/ns:Publication/ns:PageTemplateSettings/ns:PageTemplate[@xlink:href="' + $pageTemplateId + '"]', $ns)

	if (-not $pageTemplate)
	{
		$pageTemplate = $appDataXml.CreateElement("PageTemplate", $appDataXml.configuration.NamespaceURI)
		$xlink = $appDataXml.CreateAttribute("xlink", "href", $ns.LookupNamespace("xlink"))
		$xlink.Value = $pageTemplateId
		[void]$pageTemplate.SetAttributeNode($xlink)
		[void]$pageTemplate.SetAttribute("usePredefinedContentTypes", "true")
		[void]$appDataXml.configuration.Publication.PageTemplateSettings.AppendChild($pageTemplate)
	}
	
	foreach ($pageTemplate in $appDataXml.configuration.Publication.PageTemplateSettings.PageTemplate)
	{
		$contentTypeCheck = $appDataXml.CreateElement("se:ContentType", $appDataXml.configuration.NamespaceURI)
		$xlink = $appDataXml.CreateAttribute("xlink", "href", $ns.LookupNamespace("xlink"))
		$xlink.Value = $componentId
		[void]$contentTypeCheck.SetAttributeNode($xlink)
		[void]$pageTemplate.AppendChild($contentTypeCheck)
	}

	$appDataAdapter = New-Object Tridion.ContentManager.CoreService.Client.ApplicationDataAdapter $applicationId, $appDataXml.configuration
	$appData = $appDataAdapter.ApplicationData

	$coreServiceClient.SaveApplicationData($itemId, $appData)
	Write-Host "ContentType 'Tridion Docs' created successfully."
}
else {
	Write-Host "ContentType 'Tridion Docs' already exists. A new one will not be created."
}

$coreServiceClient.Dispose()