<#
.Synopsis
   Import the Google Analytics Module into CMS
.DESCRIPTION
   Import the Google Analytics Module into CMS
.EXAMPLE
   & .\cms-import.ps1 -cmsUrl "http://localhost:81/" 
.INPUTS
   importType, cmsUrl, masterPublication, sitePublication, rootStructureGroup
.NOTES
   Importing into existing publication by means of mapping a target publication title is currently not supported for rights and permissions
.COMPONENT
   The component this cmdlet belongs to
.ROLE
   The role this cmdlet belongs to
.FUNCTIONALITY
   The functionality that best describes this cmdlet
#>

[CmdletBinding( SupportsShouldProcess=$true, 
                PositionalBinding=$false)]
param (
    [ValidateSet("module-and-permissions", "module-only", "permissions-only")]
    [string]$importType = "module-and-permissions",

    # Set this to your cms url
    [string]$cmsUrl = "http://localhost/",

    # If you are importing into existing publications, update these to map to your target publication titles
    [string]$masterPublication = "100 Master",

    # If you are importing into existing publications, update these to map to your target publication titles
    [string]$sitePublication = "400 Example Site",

    # If you are importing into existing publications, update these to map to your root folder and structure group title
    [string]$rootStructureGroup = "Home"
)

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

# Thanks to Dominic Cronin: http://www.indivirtual.nl/blog/sdl-tridions-importexport-api-end-content-porter/
function Invoke-InitImportExport ($distSource, $tempFolder) {
    $localDllFolder = "$($distSource)..\..\ImportExport\"
    # Copy all DLLs to a local accessible location, since we cannot load DLLs from a network location
    if ($distSource.StartsWith("\\") -or !((New-Object System.IO.DriveInfo (New-Object System.IO.FileInfo $distSource).Directory.Root.FullName).DriveType -eq "Fixed")) {
        if (!(Test-Path $tempFolder\Tridion.ContentManager.ImportExport.*)) {
            #Copy-Item works weird if destination folder does not exist
            if (!(Test-Path $tempFolder)) {
                Write-Verbose "Creating temp folder ..."
                New-Item -ItemType Directory -Path $tempFolder | Out-Null
            }
            Write-Output "Copying ImportExport assemblies ..."
            Copy-Item "$($distSource)ImportExport\*" $tempFolder -Recurse -Force
            Write-Output "Done"
        }
        $localDllFolder = $tempFolder
    }
    Write-Output "Initializing types for ImportExport ..."
    Add-Type -assemblyName mscorlib
    Add-Type -assemblyName System.ServiceModel
    Add-Type -Path "$($localDllFolder)ChilkatDotNet4.dll"
    Add-Type -Path "$($localDllFolder)Tridion.Common.dll"
    Add-Type -Path "$($localDllFolder)Tridion.ContentManager.CoreService.Client.dll"
    Add-Type -Path "$($localDllFolder)Tridion.ContentManager.ImportExport.Common.dll"
    Add-Type -Path "$($localDllFolder)Tridion.ContentManager.ImportExport.Client.dll"
    Write-Output "Done"
}

function Get-ImportExportServiceClient {
    param(
        [parameter(Mandatory=$false)]
        [AllowNull()]
        [ValidateSet("Service","Upload","Download")]
        [string]$type="Service"
    )
    Write-Verbose "Getting ImportExport Service Client with type '$type' ..."

	$binding = New-Object System.ServiceModel.BasicHttpBinding
	$binding.MaxBufferPoolSize = [int]::MaxValue
	$binding.MaxReceivedMessageSize = [int]::MaxValue
	$binding.ReaderQuotas.MaxArrayLength = [int]::MaxValue
	$binding.ReaderQuotas.MaxBytesPerRead = [int]::MaxValue
	$binding.ReaderQuotas.MaxStringContentLength = [int]::MaxValue
	$binding.ReaderQuotas.MaxNameTableCharCount = [int]::MaxValue
	
	switch($type)
	{
		"Service" {
			$binding.Security.Mode = "TransportCredentialOnly"
			$binding.Security.Transport.ClientCredentialType = "Windows"
			$endpoint = New-Object System.ServiceModel.EndpointAddress ($cmsUrl + "webservices/ImportExportService2013.svc/basicHttp")
			New-Object Tridion.ContentManager.ImportExport.Client.ImportExportServiceClient $binding,$endpoint
		}
 
		"Download" {
			$binding.Security.Mode = "TransportCredentialOnly"
			$binding.Security.Transport.ClientCredentialType = "Windows"
			$binding.TransferMode = "StreamedResponse"
			$binding.MessageEncoding = "Mtom"
			$endpoint = New-Object System.ServiceModel.EndpointAddress ($cmsUrl + "webservices/ImportExportService2013.svc/streamDownload_basicHttp")	
			New-Object Tridion.ContentManager.ImportExport.Client.ImportExportStreamDownloadClient $binding,$endpoint
		}
 
		"Upload" {
			$binding.Security.Mode = "None"
			$binding.TransferMode = "StreamedRequest"
			$binding.MessageEncoding = "Mtom"
			$endpoint = New-Object System.ServiceModel.EndpointAddress ($cmsUrl + "webservices/ImportExportService2013.svc/streamUpload_basicHttp")
			New-Object Tridion.ContentManager.ImportExport.Client.ImportExportStreamUploadClient $binding,$endpoint
		}
	}
    Write-Verbose "Done"
}

function Get-CoreServiceClient {
    param(
        [parameter(Mandatory=$false)]
        [AllowNull()]
        [ValidateSet("Service","Upload","Download")]
        [string]$type="Service"
    )        
    Write-Verbose "Getting Core Service Client with type '$type' ..."

	$binding = New-Object System.ServiceModel.WSHttpBinding
	$binding.MaxBufferPoolSize = [int]::MaxValue
	$binding.MaxReceivedMessageSize = [int]::MaxValue
	$binding.ReaderQuotas.MaxArrayLength = [int]::MaxValue
	$binding.ReaderQuotas.MaxBytesPerRead = [int]::MaxValue
	$binding.ReaderQuotas.MaxStringContentLength = [int]::MaxValue
	$binding.ReaderQuotas.MaxNameTableCharCount = [int]::MaxValue
	
	switch($type)
	{
		"Service" {
			$binding.Security.Mode = "Message"
			$endpoint = New-Object System.ServiceModel.EndpointAddress ($cmsUrl + "webservices/CoreService2013.svc/wsHttp")
			New-Object Tridion.ContentManager.CoreService.Client.SessionAwareCoreServiceClient $binding,$endpoint
        }
	}
    Write-Verbose "Done"
}

function Get-Trustee($group) {
    # load trustee from group name
    $groupsFilter = new-object Tridion.ContentManager.CoreService.Client.groupsFilterData
    $list = $core.GetSystemWideList($groupsFilter)
    foreach ($trustee in $list) {
        if ($trustee.Title -match $group) {
            return $trustee
        }
    }
    return $null
}

# Thanks to Dominic Cronin: http://www.indivirtual.nl/blog/set-rights-permissions-using-sdl-tridion-core-service-api/
function Set-RightsAndPermissions($trustee, $orgItem, $rights, $permissions) {
    # No need to localize, we exported from local items only
    #$autoLocalize = $true
    #if ($autoLocalize -and $orgItem.BluePrintInfo.IsShared){
    #    $orgItem = $core.Localize($orgItem.Id, $defaultReadOptions)
    #}

    Write-Verbose "Updating $($orgItem.LocationInfo.Webdavurl) for $($trustee.Id) ..."

    # need to strip out any existing entries for this trustee
    $entries = $orgItem.AccessControlList.AccessControlEntries | ? {$_.Trustee.IdRef -ne $trustee.Id}
    $link = new-object Tridion.ContentManager.CoreService.Client.LinkToTrusteeData
    $link.IdRef = $trustee.Id
 
    $ace = new-object Tridion.ContentManager.CoreService.Client.AccessControlEntryData
    $ace.Trustee = $link
    if ($rights -ne $null) {$ace.AllowedRights = $rights}
    if ($permissions -ne $null) {
        $ace.AllowedPermissions = $permissions
        $orgItem.IsPermissionsInheritanceRoot = $true
    }
    $entries += $ace
    $orgItem.AccessControlList.AccessControlEntries = $entries
    $core.Save($orgItem, $null)
    
    Write-Verbose "Done"
}

function Set-Rights($webdavUrl, $group, $rights) {
    Write-Output "Setting $rights for $group in $webdavUrl ..."    

    $trustee = Get-Trustee $group
    try {
        $item = $core.Read($webdavUrl, $defaultReadOptions)
        Set-RightsAndPermissions $trustee $item $rights $null
    } 
    catch {
        Write-Warning "Skipped, $webdavUrl does not exist"
    }
    
    Write-Output "Done"
}

function Set-Permissions($webdavUrl, $group, $permissions) {
    Write-Output "Setting $permissions for $group in $webdavUrl ..."

    $trustee = Get-Trustee $group
    try {
        $item = $core.Read($webdavUrl, $defaultReadOptions)
        Set-RightsAndPermissions $trustee $item $null $permissions
    } 
    catch {
        Write-Warning "Skipped, $webdavUrl does not exist"
    }

    Write-Output "Done"
}

function Invoke-UploadPackageFromFile($packageLocation) {
    Write-Verbose "Uploading package from file ..."
    Write-Verbose "PackageLocation is '$packageLocation'"
	$uploadService = Get-ImportExportServiceClient -type Upload
	try {
		$packageStream = [IO.File]::OpenRead($packageLocation)
		$uploadService.UploadPackageStream($packageStream)
	}
    catch {
        Write-Verbose "Upload exception: $($_.Exception.Message)"
    }
	finally {
		if ($packageStream -ne $null){
			$packageStream.Dispose()	
		}
		if ($uploadService -ne $null){
			$uploadService.Dispose()	
		}
	}
    Write-Verbose "Done"
}
 
function Wait-ImportExportFinish($serviceClient, $processId) {
    Write-Verbose "Waiting operation to finish ..."
    Write-Verbose "Process Id is '$processId'"
	do {
		$processState = $serviceClient.GetProcessState($processId)
		if ("Finished", "Aborted", "AbortedByUser" -contains $processState) {
            Write-Verbose "Process State is '$processState'"
			break;
		}
		sleep 1
	} while ($true)
    Write-Verbose "Done"
    return $processState
}

function Invoke-DownloadLog($processId, $path) {
    Write-Output "Downloading log of operation ..."
    Write-Verbose "Process Id is '$processId'"
    Write-Verbose "Path is '$path'"
    $downloadClient = Get-ImportExportServiceClient -type Download
    try {
	    $packageStream = $downloadClient.DownloadProcessLogFile($processId, $true)
	    $fileStream = [IO.File]::Create($path)
	    $packageStream.CopyTo($fileStream)
    }	
    catch {
        Write-Verbose "DownloadLog exception: $($_.Exception.Message)"
    }
    finally { 
	    if ($fileStream -ne $null) {
		    $fileStream.Dispose()
	    }
	    if ($packageStream -ne $null) {
		    $packageStream.Dispose()
	    }
    }
    Write-Output "Done"
}

function Invoke-Upload($mapping, $packageFullPath, $tempFolder) {
    Write-Output "Uploading package ..."
    Write-Verbose "Package FullPath is '$packageFullPath'"
    Write-Verbose "Temp Folder is '$tempFolder'"
    Write-Verbose ("Mapping is null? " + ($mapping -eq $null))
    $filename = (Get-ChildItem $packageFullPath).BaseName
    $extension = (Get-ChildItem $packageFullPath).Extension
    $uploadId = Invoke-UploadPackageFromFile $packageFullPath

    Write-Output "Importing content ..."
    $impexp = Get-ImportExportServiceClient
    $importInstruction = New-Object Tridion.ContentManager.ImportExport.ImportInstruction
    #$importInstruction.LogLevel = "Debug"
    $importInstruction.LogLevel = "Normal"
    $importInstruction.CreateUndoPackage = $true
    $importInstruction.SchemaSynchronizeFlags = 103

    if($mapping -ne $null) {
        $importInstruction.UserMappings = [Tridion.ContentManager.ImportExport.Packaging.Mapping[]]($mapping)
    }
    
    $processId = $impexp.StartImport($uploadId, ($importInstruction))
    $state = Wait-ImportExportFinish $impexp $processId
    Write-Output "Done"

    $importLogFullPath = "$($tempFolder)$($filename)-import.log"
    Write-Verbose "Import log file is '$importLogFullPath'"
    Invoke-DownloadLog $processId $importLogFullPath
    # Output log to console
    Get-Content $importLogFullPath

    Write-Output "Done Upload: $($state)"

    if($state -ne "Finished") {
        throw "Problem importing file $($filename)$($extension) $($impexp.GetProcessInfo($processId).Messages)"
    }
    if ($impexp -ne $null) {
        $impexp.Dispose()
    }
}

function Add-ComponentToPage($sitePublication, $rootStructureGroup, $componentPath, $templatePath, $pagePath) {
    $pageWebdavUrl = [string]::Format("/webdav/{0}/{1}/{2}.tpg", $sitePublication, $rootStructureGroup, $pagePath)
    $componentWebdavUrl = [string]::Format("/webdav/{0}/Building Blocks/{1}.xml", $sitePublication, $componentPath)
    $templateWebdavUrl = [string]::Format("/webdav/{0}/Building Blocks/{1}.tctcmp", $sitePublication, $templatePath)
    Write-Output "Adding Component '$($componentWebdavUrl)' to Page '$($pageWebdavUrl)' ..."
    Write-Verbose "Publication is '$sitePublication'"
    Write-Verbose "Structure group is '$rootStructureGroup'"
    Write-Verbose "Page Webdav Url is '$pageWebdavUrl'"
    Write-Verbose "Component Webdav Url is '$componentWebdavUrl'"
    Write-Verbose "Template Webdav Url is '$templateWebdavUrl'"
    $page = $core.Read($pageWebdavUrl, $defaultReadOptions)
    $cps = $page.ComponentPresentations
    $component = $core.Read($componentWebdavUrl, $defaultReadOptions)
    $template = $core.Read($templateWebdavUrl, $defaultReadOptions)
    $notAdded = $true
    Write-Verbose "Checking if Component '$($component.Id)' is already added to Page"
    foreach ($c in $cps)
    {
        #CP already exists on page
        if (($c.ComponentTemplate.IdRef -eq $template.Id) -and ($c.Component.IdRef -eq $component.Id))
        {
            Write-Verbose "Existing Component is found: Component ID ='$($component.Id)'; Template ID = '$($template.Id)'"
            $notAdded = $false
        }
    }
    if ($notAdded)
    {
        $cp = New-Object Tridion.ContentManager.CoreService.Client.ComponentPresentationData
        $cp.Component = New-Object Tridion.ContentManager.CoreService.Client.LinkToComponentData
        $cp.Component.IdRef = $component.Id
        $cp.ComponentTemplate = New-Object Tridion.ContentManager.CoreService.Client.LinkToComponentTemplateData
        $cp.ComponentTemplate.IdRef = $template.Id
        $cps += $cp
        $page = $core.CheckOut($page.Id, $false, $defaultReadOptions)
        $page.ComponentPresentations = $cps
        $page = $core.Save($page, $defaultReadOptions)
        $page = $core.CheckIn($page.Id, $true, $null, $defaultReadOptions)
        Write-Output "Done"
    }
    else
    {
        Write-Warning "Component already added to Page. Skipping this step."
    }
}


#Process 'WhatIf' and 'Confirm' options
if (!($pscmdlet.ShouldProcess("Tridion Content Manager", "Import the reference implementation"))) { return }

$distSource = Join-Path (Split-Path $MyInvocation.MyCommand.Path) "\"

#Create temp folder in %temp% location
$tempFolder = Join-Path $env:ALLUSERSPROFILE "TRI\"
if (!(Test-Path $tempFolder)) {
    New-Item -ItemType Directory -Path $tempFolder | Out-Null
}
Write-Verbose "Temp folder is '$tempFolder'"

#Format data
$distSource = $distSource.TrimEnd("\") + "\"
$cmsUrl = $cmsUrl.TrimEnd("/") + "/"

$importPackageFullPath = Join-Path $distSource "module-GoogleAnalytics.zip"
Write-Verbose "Import Package FullPath is '$importPackageFullPath'"

$permissionsFullPath = Join-Path $distSource "permissions.xml"
Write-Verbose "Permissions file FullPath is '$permissionsFullPath'"

Invoke-InitImportExport $distSource $tempFolder

# Create core service client and default read options
$core = Get-CoreServiceClient "Service"
$defaultReadOptions = New-Object Tridion.ContentManager.CoreService.Client.ReadOptions

# Mappings - only edit these if you really know what you are doing!
$detailedMapping = (
    (New-Object Tridion.ContentManager.ImportExport.Packaging.V2013.Mapping2013("Publication", "/webdav/100 Master",("/webdav/" + $masterPublication))),
    (New-Object Tridion.ContentManager.ImportExport.Packaging.V2013.Mapping2013("StructureGroup", "/webdav/100 Master/Home",("/webdav/" + $masterPublication + "/" + $rootStructureGroup))),
    (New-Object Tridion.ContentManager.ImportExport.Packaging.V2013.Mapping2013("Publication", "/webdav/400 Example Site",("/webdav/" + $sitePublication))),
    (New-Object Tridion.ContentManager.ImportExport.Packaging.V2013.Mapping2013("StructureGroup", "/webdav/400 Example Site/Home",("/webdav/" + $sitePublication + "/" + $rootStructureGroup)))
)

if ($importType -ne "permissions-only")
{
    Invoke-Upload $detailedMapping $importPackageFullPath $tempFolder
    Add-ComponentToPage $sitePublication $rootStructureGroup "Settings/GoogleAnalytics/Site Manager/Google Analytics Configuration" "Modules/GoogleAnalytics/Site Manager/Templates/Google Analytics [Links]"  "_System/include/Footer" 
}

#   NOTE - this should be executed last after importing all modules and does not work for mapped publications
if ($importType -ne "module-only")
{
    # for rights and permissions import we do not map publications (this doesn't work - need to change the permissions.xml file manually to map to the right publications)
    [xml]$xml = Get-Content $permissionsFullPath
    foreach ($publication in $xml.export.publication) {
        $path = $publication.path
        foreach ($entry in $publication.rights) {
            $group = $entry.group
            $rights = $entry.innerText
            Set-Rights $path $group $rights
        }
    }
    foreach ($orgItem in $xml.export.organizationalItem) {
        $path = $orgItem.path
        foreach ($entry in $orgItem.permissions) {
            $group = $entry.group
            $permissions = $entry.innerText
            Set-Permissions $path $group $permissions
        }
    }
}

$core.dispose()
#Write-Output "Done"