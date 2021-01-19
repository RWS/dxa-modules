<#
.SYNOPSIS
   Utility functions for interfacing with Content Manager Core Service and Import/Export Service
.DESCRIPTION
    This script is intended to be included (dot-sourced) into other PowerShell scripts.
    Note: this script expects the following variables to be defined/set by the invoking script: 
        $cmsUrl
        $cmsAuth
        $cmsUserName (optional)
        $cmsUserPassword (optional)

    Based on:
    http://www.indivirtual.nl/blog/sdl-tridions-importexport-api-end-content-porter/
    http://www.indivirtual.nl/blog/set-rights-permissions-using-sdl-tridion-core-service-api/
#>

function Get-TempFolder($folderName)
{
    $tempFolder = Join-Path $env:ALLUSERSPROFILE "$folderName\"
    if (!(Test-Path $tempFolder)) 
    {
        New-Item -ItemType Directory -Path $tempFolder | Out-Null
    }
    Write-Verbose "Temp folder is '$tempFolder'"
    return $tempFolder
}

function Test-Url($baseUrl, $endPointUrl) 
{
    try
    {
        $url = $baseUrl.TrimEnd("/") + $endPointUrl
        if ($cmsAuth -eq "Basic" -and $cmsUserName) 
        {
            $securePass = ConvertTo-SecureString -String $cmsUserPassword -AsPlainText -Force
            $credentials = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList ($cmsUserName, $securePass)
            Invoke-WebRequest $url -DisableKeepAlive -UseBasicParsing -Method get -Credential $credentials
        }
        else
        {
            # Don't use credentials if Windows auth is used
            Invoke-WebRequest $url -DisableKeepAlive -UseBasicParsing -Method get
        }
        return $true
    }
    catch
    {
        Write-Host "Cannot retrieve data for URL '$url': $($_.Exception.Message)"
        return $false  
    }  
}

function Get-CoreServiceContractVersion 
{
    Write-Verbose "Determining latest contract version supported by Core Service ..."

    foreach($v in "201701", "201501")
    {
        if(Test-Url $cmsUrl "/webservices/CoreService$v.svc?wsdl")
        {        
            Write-Verbose "Core Service supports contract version $v"
            return $v
        }       
    }

    throw "Unable to determine Core Service version using base URL '$cmsUrl'"
}    

function Get-ImportExportContractVersion 
{
    if(Is-Sites9) 
    { 
        return "201601"
    }   
 
    return "201501"
}   

function Get-SecurePass($password)
{
    if (!$password) 
    {
        return "";
    }
    $securePass = ConvertTo-SecureString -String $password -AsPlainText -Force
    return $securePass;
}

function Join-Url ($Parts = $null, $Separator = '/')
{
    ($Parts | Where-Object { $_ } | ForEach-Object { ([string]$_).Trim($Separator) } | Where-Object { $_ } ) -Join $Separator 
}

function Get-Credentials([String] $type, [String] $name, [String] $password)
{

    Write-Host "Getting credentials for auth type $type. User name is: $name" | Out-Null

    switch ($type) 
    {
        "Basic" 
        {
            if (!$name -or !$password) {
                throw "CMS user name and password must be specified for Basic authentication."
            }

            Write-Host "Using Basic authentication with CMS user name: $name" | Out-Null
            $securePass = Get-SecurePass($password)
            $creds = New-Object System.Net.NetworkCredential $name, $securePass
        }

        "Windows" 
        {
            if ($name) {
                Write-Host "Using Windows authentication with CMS user name: $name" | Out-Null
                $securePass = Get-SecurePass($password);
                $creds = New-Object System.Net.NetworkCredential $name, $securePass
            }
            else {
                Write-Host "Using Windows authentication with the current Windows user's credentials (no CMS user specified explicitly)."
                $creds = [System.Net.CredentialCache]::DefaultNetworkCredentials
            }
        }
    }

    return $creds
}

function Is-Sites9 {
    # sites9 uses a contract version of 201701 (whereas web8 will use 201501)
    return (Get-CoreServiceContractVersion) -eq "201701"
} 

function Initialize-CoreServiceClient($importExportFolder, $tempFolder) 
{
    Write-Verbose "Initializing Core Service client using folder '$importExportFolder'"

    if ($importExportFolder.StartsWith("\\") -or !((New-Object System.IO.DriveInfo (New-Object System.IO.FileInfo $importExportFolder).Directory.Root.FullName).DriveType -eq "Fixed")) {
        # Copy all DLLs to a local accessible location, since we cannot load DLLs from a network location
        if (!$tempFolder)
        {
            $tempFolder = Get-TempFolder("DXA")
        }

        if (!(Test-Path "$tempFolder\Tridion.ContentManager.CoreService.Client.dll")) 
        {
            #Copy-Item works weird if destination folder does not exist
            if (!(Test-Path $tempFolder)) 
            {
                New-Item -ItemType Directory -Path $tempFolder | Out-Null
            }
            Write-Verbose "Copying assemblies from '$importExportFolder' to '$tempFolder' ..."
            Copy-Item "$importExportFolder\*" $tempFolder -Recurse -Force
            Write-Verbose "Done"
        }
        $importExportFolder = $tempFolder
    }

    $platform = if(Is-Sites9) { "sites9" } else { "web8" }   
    Add-Type -assemblyName mscorlib
    Add-Type -assemblyName System.ServiceModel
    Add-Type -Path "$importExportFolder\$platform\Tridion.ContentManager.CoreService.Client.dll"

    Write-Verbose "Done."

    return $importExportFolder
}

function Initialize-ImportExport($importExportFolder, $tempFolder) 
{
    $importExportFolder = Initialize-CoreServiceClient $importExportFolder $tempFolder 

    Write-Verbose "Initializing Import/Export using folder '$importExportFolder'"

    $platform = if(Is-Sites9) { "sites9" } else { "web8" }   
    Add-Type -Path "$importExportFolder\$platform\Tridion.Common.dll"
    Add-Type -Path "$importExportFolder\$platform\Tridion.ContentManager.ImportExport.Common.dll"
    Add-Type -Path "$importExportFolder\$platform\Tridion.ContentManager.ImportExport.Client.dll"

    Write-Verbose "Done."
}

function Set-ClientCredentials($wcfClient) {
    Write-Host "Setting credentials for Core Service Client for user $cmsUserName. Authentication type is $cmsAuth"
    switch ($cmsAuth) {
        "Windows" {
            $creds = Get-Credentials -type $cmsAuth -name $cmsUserName -password $cmsUserPassword;
            $wcfClient.ClientCredentials.Windows.ClientCredential = $creds;
        }
        "Basic" {
            if (!$cmsUserName -or !$cmsUserPassword) {
                throw "CMS user name and password must be specified for Basic authentication."
            }
            Write-Verbose "Using Basic authentication with CMS user name: $cmsUserName"
            $wcfClient.ClientCredentials.UserName.UserName = $cmsUserName
            $wcfClient.ClientCredentials.UserName.Password = $cmsUserPassword
        }
    }

}

function Get-ImportExportServiceClient {
    param(
        [parameter(Mandatory=$false)]
        [ValidateSet("Service","Upload","Download")]
        [string]$type="Service"
    )
    Write-Verbose "Getting Import/Export Service Client with type '$type' for CMS URL '$cmsUrl' ..."

    $binding = New-Object System.ServiceModel.BasicHttpBinding
    $binding.SendTimeout = [int]::MaxValue
    $binding.MaxBufferPoolSize = [int]::MaxValue
    $binding.MaxReceivedMessageSize = [int]::MaxValue
    $binding.ReaderQuotas.MaxArrayLength = [int]::MaxValue
    $binding.ReaderQuotas.MaxBytesPerRead = [int]::MaxValue
    $binding.ReaderQuotas.MaxStringContentLength = [int]::MaxValue
    $binding.ReaderQuotas.MaxNameTableCharCount = [int]::MaxValue
    $contract = Get-ImportExportContractVersion
    switch($type)
    {
        "Service" {
            if ($cmsUrl.StartsWith("https")) { $binding.Security.Mode = "Transport" }
            else { $binding.Security.Mode = "TransportCredentialOnly" }
            $binding.Security.Transport.ClientCredentialType = $cmsAuth
            $endpoint = New-Object System.ServiceModel.EndpointAddress (Join-Url $cmsUrl,"webservices/ImportExportService$contract.svc/basicHttp")
            $client = New-Object Tridion.ContentManager.ImportExport.Client.ImportExportServiceClient $binding,$endpoint
        }
 
        "Download" {
            if ($cmsUrl.StartsWith("https")) { $binding.Security.Mode = "Transport" }
            else { $binding.Security.Mode = "TransportCredentialOnly" }
            $binding.Security.Transport.ClientCredentialType = $cmsAuth
            $binding.TransferMode = "StreamedResponse"
            $binding.MessageEncoding = "Mtom"
            $endpoint = New-Object System.ServiceModel.EndpointAddress (Join-Url $cmsUrl,"webservices/ImportExportService$contract.svc/streamDownload_basicHttp") 
            $client = New-Object Tridion.ContentManager.ImportExport.Client.ImportExportStreamDownloadClient $binding,$endpoint
        }
 
        "Upload" {
            if ($cmsUrl.StartsWith("https")) { $binding.Security.Mode = "Transport" }
            else { $binding.Security.Mode = "None" }
            $binding.TransferMode = "StreamedRequest"
            $binding.MessageEncoding = "Mtom"
            $endpoint = New-Object System.ServiceModel.EndpointAddress (Join-Url $cmsUrl,"webservices/ImportExportService$contract.svc/streamUpload_basicHttp")
            $client = New-Object Tridion.ContentManager.ImportExport.Client.ImportExportStreamUploadClient $binding,$endpoint
        }
    }


    Set-ClientCredentials($client)

    Write-Verbose $client.Endpoint.Address
    return $client
}

function Get-CoreServiceClient {
    param(
        [parameter(Mandatory=$false)]
        [ValidateSet("Service","Upload","Download")]
        [string]$type="Service"
    )        
    Write-Verbose "Getting Core Service Client with type '$type' for CMS URL '$cmsUrl' ..."

    $binding = New-Object System.ServiceModel.BasicHttpBinding
    $binding.SendTimeout = [int]::MaxValue
    $binding.MaxBufferPoolSize = [int]::MaxValue
    $binding.MaxReceivedMessageSize = [int]::MaxValue
    $binding.ReaderQuotas.MaxArrayLength = [int]::MaxValue
    $binding.ReaderQuotas.MaxBytesPerRead = [int]::MaxValue
    $binding.ReaderQuotas.MaxStringContentLength = [int]::MaxValue
    $binding.ReaderQuotas.MaxNameTableCharCount = [int]::MaxValue   
    $contract = Get-CoreServiceContractVersion
    switch($type)
    {
        "Service" {
            if ($cmsUrl.StartsWith("https")) { $binding.Security.Mode = "Transport" }
            else { $binding.Security.Mode = "TransportCredentialOnly" }
            $binding.Security.Transport.ClientCredentialType = $cmsAuth
            $endpoint = New-Object System.ServiceModel.EndpointAddress (Join-Url $cmsUrl,"webservices/CoreService$contract.svc/basicHttp")            
            $client = New-Object Tridion.ContentManager.CoreService.Client.CoreServiceClient $binding,$endpoint
        }
    }

    Set-ClientCredentials($client)

    Write-Verbose $client.Endpoint.Address

    if ($type -eq "Service")
    {
        $cmsUser = $client.GetCurrentUser()
        $cmsUserTitle = $cmsUser.Title
        $cmsUserDescription = $cmsUser.Description
        Write-Verbose "Connected to Core Service as user '$cmsUserTitle' ($cmsUserDescription)" 
    }

    return $client;
}

$groups = $null 

function Get-Group($groupName, $coreServiceClient) {
    if (!$groups)
    {
        $groupsFilter = New-Object Tridion.ContentManager.CoreService.Client.groupsFilterData
        $groups = $coreServiceClient.GetSystemWideList($groupsFilter)
    }

    $group = $groups | Where { $_.Title -eq $groupName }
    if (!$group)
    {
        $group = New-Object Tridion.ContentManager.CoreService.Client.GroupData
        $group.Title = $groupName
        $group.Description = $groupName

        $readOptions = New-Object Tridion.ContentManager.CoreService.Client.ReadOptions
        $group = $coreServiceClient.Create($group, $readOptions)
        Write-Host "Created Group '$groupName': " $group.Id

        $groups += $group
    }

    return $group
}


function Set-AccessControlEntry($container, $trustee, $rights, $permissions) 
{
    # Remove any existing entries for this trustee
    $aces = $container.AccessControlList.AccessControlEntries | Where { $_.Trustee.IdRef -ne $trustee.Id }

    # If there is any ACE with UnknownByClient flag (e.g. BPT Management Rights since we're using a 7.1 client), the entire ACL won't get updated. As a work-around, we remove the ACE.
    $aces = $aces | Where { -not $_.AllowedRights.HasFlag([Tridion.ContentManager.CoreService.Client.Rights]::UnknownByClient) }

    $trusteeLink = New-Object Tridion.ContentManager.CoreService.Client.LinkToTrusteeData
    $trusteeLink.IdRef = $trustee.Id
 
    $ace = New-Object Tridion.ContentManager.CoreService.Client.AccessControlEntryData
    $ace.Trustee = $trusteeLink
    if ($rights) 
    {
        $ace.AllowedRights = $rights
    }
    if ($permissions) 
    {
        $ace.AllowedPermissions = $permissions
        $container.IsPermissionsInheritanceRoot = $true
    }
    $aces += $ace
    $container.AccessControlList.AccessControlEntries = $aces
}


function Import-Security($securityFilePath, $coreServiceClient) 
{
    $securityFilePath = Add-CmVersion($securityFilePath)

    Write-Host "Importing security settings from file '$securityFilePath'..."

    [xml]$securityXml = Get-Content $securityFilePath

    foreach ($publicationElement in $securityXml.export.publication) 
    {
        $publicationWebDavUrl = $publicationElement.path
        $publication = $coreServiceClient.TryRead($publicationWebDavUrl, $null)
        if ($publication)
        {
            Write-Host "Publication '$publicationWebDavUrl' ($($publication.Id)):"
            foreach ($entry in $publicationElement.rights) 
            {
                $group = Get-Group $entry.group $coreServiceClient
                $rights = $entry.InnerText
                Write-Host "`tGroup '$($group.Title)' ($($group.Id)) Rights: " $rights
                Set-AccessControlEntry $publication $group $rights $null
            }
            $coreServiceClient.Update($publication, $null)
        }
        else
        {
            Write-Warning "Publication '$publicationWebDavUrl' not found."
        }
    }

    foreach ($orgItemElement in $securityXml.export.organizationalItem) 
    {
        $orgItemWebDavUrl = $orgItemElement.path
        $orgItem = $coreServiceClient.TryRead($orgItemWebDavUrl, $null)
        if ($orgItem)
        {
            Write-Host "Organizational Item '$orgItemWebDavUrl' ($($orgItem.Id)):"
            foreach ($entry in $orgItemElement.permissions) 
            {
                $group = Get-Group $entry.group $coreServiceClient
                $permissions = $entry.InnerText
                Write-Host "`tGroup '$($group.Title)' ($($group.Id)) Permissions: " $permissions
                Set-AccessControlEntry $orgItem $group $null $permissions
             }
            $coreServiceClient.Update($orgItem, $null)
        }
        else
        {
            Write-Warning "Organizational Item '$orgItemWebDavUrl' not found."
        }
    }
}


function Invoke-UploadPackageFromFile($packageLocation) {
    Write-Verbose "Uploading package from file ..."
    Write-Verbose "PackageLocation is '$packageLocation'"
    $uploadService = Get-ImportExportServiceClient -type Upload
    try {
        $packageStream = [IO.File]::OpenRead($packageLocation)
        $uploadService.UploadPackageStream($packageStream)
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
    Write-Verbose "Waiting for Import/Export Process '$processId' to finish ..."

    $waited = 0
    $interval = 5
    do {
        $processState = $serviceClient.GetProcessState($processId)
        if ("Finished", "Aborted", "AbortedByUser" -contains $processState) {
            break;
        }

        Start-Sleep -Seconds $interval
        $waited = $waited + $interval
        Write-Verbose "($waited seconds)"
    } while ($true)

    Write-Verbose "Process State is '$processState'"
    return $processState
}

function Invoke-DownloadLog($processId, $path) {
    Write-Verbose "Downloading log for Import/Export Process '$processId' to '$path' ..."
    $downloadClient = Get-ImportExportServiceClient -type Download
    try {
        $packageStream = $downloadClient.DownloadProcessLogFile($processId, $true)
        $fileStream = [IO.File]::Create($path)
        $packageStream.CopyTo($fileStream)
    }    
    finally { 
        if ($fileStream -ne $null) {
            $fileStream.Dispose()
        }
        if ($packageStream -ne $null) {
            $packageStream.Dispose()
        }
    }
    Write-Verbose "Done"
}


function Invoke-DownloadPackage($processId, $path) {    
    Write-Verbose "Downloading package for Import/Export Process '$processId' to '$path' ..."
    $downloadService = Get-ImportExportServiceClient -type Download
    try {
        $packageStream = $downloadService.DownloadPackage($processId, $true)    
        $fileStream = [IO.File]::Create($path)
        $packageStream.CopyTo( $fileStream)
    }    
    finally { 
        if ($fileStream -ne $null) {
            $fileStream.Dispose()
        }
        if ($packageStream -ne $null) {
            $packageStream.Dispose()
        }
    }
}


# Deprecated (DXA 1.2) function. Use Import-CmPackage instead. 
function Invoke-Upload($mapping, $packageFullPath, $tempFolder) 
{
    Write-Warning "Using deprecated Invoke-Upload function. Use Import-CmPackage instead."
    Import-CmPackage $packageFullPath $tempFolder $mapping
}

function Is-Web8
{
    $cmsVersion = $coreServiceClient.GetApiVersion()
    $majorVersion = $cmsVersion.Split(".")[0] -as [int];
    if($majorVersion -lt 9)
    {
        return $true
    }
    return $false
}

function Add-CmVersion($packageFullPath)
{
    $cmsVersion = if(Is-Web8) {"web8"} else {"sites9"}  
    $outputFilename = Split-Path $packageFullPath -leaf
    $path = Join-Path -Path $packageFullPath.Replace($outputFilename, $cmsVersion) -ChildPath $outputFilename
    return $path
}

function Import-CmPackage($packageFullPath, $tempFolder, $mappings = $null)
{
    # Adjust the package path to include cm version
    $packageFullPath = Add-CmVersion($packageFullPath)

    Write-Host "Uploading package '$packageFullPath' ..."
    $filename = (Get-ChildItem $packageFullPath).BaseName
    $extension = (Get-ChildItem $packageFullPath).Extension
    $uploadId = Invoke-UploadPackageFromFile $packageFullPath

    Write-Host "Importing content ..."
    $importInstruction = New-Object Tridion.ContentManager.ImportExport.ImportInstruction
    #$importInstruction.LogLevel = "Debug"
    $importInstruction.LogLevel = "Normal"
    $importInstruction.CreateUndoPackage = $false
    $importInstruction.SchemaSynchronizeFlags = "FixNamespace, RemoveUnknownFields, RemoveAdditionalValues, ApplyDefaultValuesForMissingMandatoryFields, ConvertFieldType"

    if ($mappings)
    {
        Write-Verbose "Using mappings:"
        $mappings | ForEach-Object { Write-Verbose "`t'$($_.ExportUrl)' -> '$($_.ImportUrl)'" }
        $importInstruction.UserMappings = [Tridion.ContentManager.ImportExport.Packaging.Mapping[]]($mappings)
    }
    
    $importExportClient = Get-ImportExportServiceClient
    $processId = $importExportClient.StartImport($uploadId, ($importInstruction))
    $state = Wait-ImportExportFinish $importExportClient $processId
    Write-Host $state
    $importExportClient.Dispose()

    # Download log and output it
    $importLogFullPath = "$($tempFolder)$($filename)-import.log"
    Invoke-DownloadLog $processId $importLogFullPath
    Get-Content $importLogFullPath

    if ($state -ne "Finished") 
    {
        throw "An error occured while importing '$packageFullPath'"
    }
}


function Export-CmPackage($targetFile, $selection, $exportInstruction)
{
    Write-Host "Exporting content..."
    $importExportClient = Get-ImportExportServiceClient
    $processId = $importExportClient.StartExport($selection, $exportInstruction)
    $state = Wait-ImportExportFinish $importExportClient $processId
    Write-Host $state

    # Download log and output it
    $exportLogFullPath = "$($tempFolder)$($exportType)-export.log" 
    Invoke-DownloadLog $processId $exportLogFullPath
    Get-Content $exportLogFullPath

    Write-Host "Downloading Export Package to '$targetFile' ..."
    Invoke-DownloadPackage $processId $targetFile
}

function Encode-WebDav($path) 
{
    if(!$path.StartsWith("/webdav/"))
    {
        $path = "/webdav/" + $path.TrimStart('/');
    }
    return [uri]::EscapeUriString($path).Replace(".","%2E");
}

function Get-TcmUri($itemId)
{
    if ($itemId.StartsWith("tcm:"))
    {
        return $itemId
    }
    return $coreServiceClient.GetTcmUri($itemId, $null, $null)
}

function Get-ImportMappings($masterPublication, $siteTypePublication, $contentPublication, $sitePublication, $rootFolder, $rootStructureGroup)
{
    return (
        (New-Object Tridion.ContentManager.ImportExport.Packaging.V2013.Mapping2013("Publication", "/webdav/100 Master", (Encode-WebDav $masterPublication))),
        (New-Object Tridion.ContentManager.ImportExport.Packaging.V2013.Mapping2013("Folder", "/webdav/100 Master/Building Blocks", (Encode-WebDav "$masterPublication/$rootFolder"))),
        (New-Object Tridion.ContentManager.ImportExport.Packaging.V2013.Mapping2013("StructureGroup", "/webdav/100 Master/Home", (Encode-WebDav "$masterPublication/$rootStructureGroup"))),
        (New-Object Tridion.ContentManager.ImportExport.Packaging.V2013.Mapping2013("Publication", "/webdav/110 DXA Site Type", (Encode-WebDav $siteTypePublication))),
        (New-Object Tridion.ContentManager.ImportExport.Packaging.V2013.Mapping2013("Folder", "/webdav/110 DXA Site Type/Building Blocks", (Encode-WebDav "$siteTypePublication/$rootFolder"))),
        (New-Object Tridion.ContentManager.ImportExport.Packaging.V2013.Mapping2013("StructureGroup", "/webdav/110 DXA Site Type/Home", (Encode-WebDav "$siteTypePublication/$rootStructureGroup"))),
        (New-Object Tridion.ContentManager.ImportExport.Packaging.V2013.Mapping2013("Publication", "/webdav/200 Example Content", (Encode-WebDav $contentPublication))),
        (New-Object Tridion.ContentManager.ImportExport.Packaging.V2013.Mapping2013("Folder", "/webdav/200 Example Content/Building Blocks", (Encode-WebDav "$contentPublication/$rootFolder"))),
        (New-Object Tridion.ContentManager.ImportExport.Packaging.V2013.Mapping2013("StructureGroup", "/webdav/200 Example Content/Home", (Encode-WebDav "$contentPublication/$rootStructureGroup"))),
        (New-Object Tridion.ContentManager.ImportExport.Packaging.V2013.Mapping2013("Publication", "/webdav/400 Example Site", (Encode-WebDav $sitePublication))),
        (New-Object Tridion.ContentManager.ImportExport.Packaging.V2013.Mapping2013("Folder", "/webdav/400 Example Site/Building Blocks", (Encode-WebDav "$sitePublication/$rootFolder"))),
        (New-Object Tridion.ContentManager.ImportExport.Packaging.V2013.Mapping2013("StructureGroup", "/webdav/400 Example Site/Home", (Encode-WebDav "$sitePublication/$rootStructureGroup")))
        )
}

function Add-ComponentPresentation-Web8($componentId, $templateId, $pageId, $insertIndex = -1) 
{
    Write-Host "Adding Component Presentation ('$componentId', '$templateId') to Page '$pageId' ..."

    $page = $coreServiceClient.Read($pageId, $defaultReadOptions)
    $component = $coreServiceClient.Read($componentId, $defaultReadOptions)
    $template = $coreServiceClient.Read($templateId, $defaultReadOptions)

    $cps = $page.ComponentPresentations
    $cpList = new-object 'System.Collections.Generic.List[object]'

    foreach ($cp in $cps)
    {
        #CP already exists on page
        if (($cp.ComponentTemplate.IdRef -eq $template.Id) -and ($cp.Component.IdRef -eq $component.Id))
        {
            Write-Host "The Component Presentation is already on the Page."
            return
        }
        $cpList.Add($cp)
    }

    $cp = New-Object Tridion.ContentManager.CoreService.Client.ComponentPresentationData
    $cp.Component = New-Object Tridion.ContentManager.CoreService.Client.LinkToComponentData
    $cp.Component.IdRef = $component.Id
    $cp.ComponentTemplate = New-Object Tridion.ContentManager.CoreService.Client.LinkToComponentTemplateData
    $cp.ComponentTemplate.IdRef = $template.Id
    if($insertIndex -ge 0 -and $insertIndex -lt $cpList.Count)
    {
        $cpList.Insert($insertIndex, $cp)
    }
    else
    {
        $cpList.Add($cp)
    }

    $page.ComponentPresentations = $cpList.ToArray()
    $coreServiceClient.Update($page, $null)
}

function Add-ComponentPresentation($componentId, $templateId, $pageId, $insertIndex = -1, $regionName = "") 
{
    #This function does not support adding Component Presenation into a nested Region
    Write-Host "Adding Component Presentation ('$componentId', '$templateId') to Page '$pageId' ..."

    $page = $coreServiceClient.Read($pageId, $defaultReadOptions)
    $component = $coreServiceClient.Read($componentId, $defaultReadOptions)
    $template = $coreServiceClient.Read($templateId, $defaultReadOptions)

    $regions = $page.Regions
    $cps = $page.ComponentPresentations
    $container = $page
    $containerName = "Page"

    if($regionName -ne "")
    {
        $region = $regions | Where { $_.RegionName -eq $regionName }

        if(!$region)
        {
            $pageTitle = $page.Title
            Write-Host "'$pageTitle' Page does not have a '$regionName' Region. Adding Component Presentation to the Page"
        }
        else
        {
            $cps = [Collections.Generic.List[object]]$region.ComponentPresentations
            $container = $region
            $containerName = "Region"
        }
    }

    $cpList = new-object 'System.Collections.Generic.List[object]'
    

    foreach ($cp in $cps)
    {
        #CP already exists on page
        if (($cp.ComponentTemplate.IdRef -eq $template.Id) -and ($cp.Component.IdRef -eq $component.Id))
        {
            Write-Host "$containerName already contains this Conponent Presentation"
            return
        }
        $cpList.Add($cp)
    }

    $cp = New-Object Tridion.ContentManager.CoreService.Client.ComponentPresentationData
    $cp.Component = New-Object Tridion.ContentManager.CoreService.Client.LinkToComponentData
    $cp.Component.IdRef = $component.Id
    $cp.ComponentTemplate = New-Object Tridion.ContentManager.CoreService.Client.LinkToComponentTemplateData
    $cp.ComponentTemplate.IdRef = $template.Id

    if($insertIndex -ge 0 -and $insertIndex -lt $cpList.Count)
    {
        $cpList.Insert($insertIndex, $cp)
    }
    else
    {
        $cpList.Add($cp)
    }
    
    $container.ComponentPresentations = $cpList.ToArray()
    $coreServiceClient.Update($page, $null)
}

function Remove-ComponentPresentation($componentId, $templateId, $pageId) 
{
    function GetListWithoutSpecifiedCP($container, $componentId, $templateId)
    {
        $cpList = @()
        foreach($cp in $container)
        {
            if (($cp.ComponentTemplate.IdRef -eq $templateId) -and ($cp.Component.IdRef -eq $componentId))
            {
                $cpTitle = $cp.Component.Title
                Write-Host "The Component Presentation '$cpTitle' is removed from the Page or Region."
            }
            else
            {
                $cpList += $cp
            }
        }
        
        #Comma is used here in order to prevent function to return 'null' if array is empty
        return ,$cpList;
    }

    Write-Host "Removing Component Presentation ('$componentId', '$templateId') from Page '$pageId' ..."

    $page = $coreServiceClient.Read($pageId, $defaultReadOptions)
    $componentId = Get-TcmUri($componentId)
    $templateId = Get-TcmUri($templateId)

    [int]$removedCps = 0
    $regions = $page.Regions
    foreach($region in $regions)
    {
        $cps = GetListWithoutSpecifiedCP $region.ComponentPresentations $componentId $templateId
        $removedCps += $region.ComponentPresentations.Count - $cps.Count
        $region.ComponentPresentations = $cps
    }

    $cps = GetListWithoutSpecifiedCP $page.ComponentPresentations $componentId $templateId
    $removedCps += $page.ComponentPresentations.Count - $cps.Count
    $page.ComponentPresentations = $cps
    
    if ($removedCps -ne 0)
    {
        $coreServiceClient.Update($page, $null)
        Write-Host "Removed $removedCps Component Presentations from Page '$pageId'"
    }
    else
    {
        Write-Warning "Page '$pageId' does not contain Component Presentation ('$componentId', '$templateId')"
    }
}

function Add-TemplateToCompound($addedTbbId, $compoundTemplateId) 
{
    Write-Host "Adding Template '$addedTbbId' to Compound Template '$compoundTemplateId' ..."

    $addedTbbId = Get-TcmUri($addedTbbId)

    $compoundTemplate = $coreServiceClient.Read($compoundTemplateId, $defaultReadOptions)
    $content = [xml] $compoundTemplate.Content
    $invokedTemplates = $content.CompoundTemplate.TemplateInvocation.Template.href
    if ($invokedTemplates -contains $addedTbbId)
    {      
        Write-Host "TBB is already present."
        return
    }

    $namespaceUri = $content.CompoundTemplate.xmlns
    $templateInvocation = $content.CreateElement("TemplateInvocation", $namespaceUri)
    $template = $content.CreateElement("Template", $namespaceUri)
    $templateInvocation.AppendChild($template) | Out-Null
    $templateHref = $content.CreateAttribute("xlink:href", "http://www.w3.org/1999/xlink")
    $templateHref.Value = $addedTbbId
    $template.SetAttributeNode($templateHref) | Out-Null
    $content.DocumentElement.AppendChild($templateInvocation) | Out-Null

    $compoundTemplate.Content = $content.OuterXml
    $coreServiceClient.Update($compoundTemplate, $null)
}

function Remove-TemplateFromCompound($tbbToRemoveId, $compoundTemplateId) 
{
    Write-Host "Removing TBB '$tbbToRemoveId' from Compound Template '$compoundTemplateId' ..."

    $tbbToRemoveId = Get-TcmUri($tbbToRemoveId)

    $compoundTemplate = $coreServiceClient.Read($compoundTemplateId, $defaultReadOptions)
    $content = [xml] $compoundTemplate.Content

    $ns = New-Object System.Xml.XmlNamespaceManager($content.NameTable)
    $ns.AddNamespace("ns", $content.DocumentElement.NamespaceURI)
    $ns.AddNamespace("xlink", "http://www.w3.org/1999/xlink")

    $templateNodes = $content.SelectNodes("/ns:CompoundTemplate/ns:TemplateInvocation/ns:Template[@xlink:href='$tbbToRemoveId']", $ns)
    if ($templateNodes.Count -gt 0)
    {
        foreach ($templateNode in $templateNodes)
        {
            $templateInvocation = $templateNode.ParentNode
              $templateInvocation.ParentNode.RemoveChild($templateInvocation)
        }

        $compoundTemplate.Content = $content.OuterXml
        $coreServiceClient.Update($compoundTemplate, $null)
        Write-Host "Removed $($templateNodes.Count) TBB invocations."
    }
    else
    {
        Write-Warning "Compound Template '$compoundTemplateId' does not contain TBB '$tbbToRemoveId'"
    }
}

function Add-MetadataToItem($itemId, $schemaId, $metadata)
{
    Write-Host "Adding Metadata based on Schema '$schemaId' from Item '$itemId' ..."

    $schemaId = Get-TcmUri($schemaId)

    $item = $coreServiceClient.Read($itemId, $defaultReadOptions)
    if ($item.MetadataSchema -and ($item.MetadataSchema.IdRef -ne "tcm:0-0-0") -and ($item.MetadataSchema.IdRef -ne $schemaId))
    {
        Write-Warning "Item '$itemId' already has Metadata Schema '$($item.MetadataSchema.IdRef)'. Skipping this step."
        return
    }

    $item.MetadataSchema = New-Object Tridion.ContentManager.CoreService.Client.LinkToSchemaData
    $item.MetadataSchema.IdRef = $schemaId
    $item.Metadata = $metadata
    $coreServiceClient.Update($item, $null)
}

function Remove-MetadataFromItem($itemId)
{
    Write-Host "Removing Metadata from Item '$itemId' ..."

    $item = $coreServiceClient.Read($itemId, $defaultReadOptions)

    if ($item.MetadataSchema -and $item.MetadataSchema.IdRef -ne "tcm:0-0-0")
    {
        $item.MetadataSchema = New-Object Tridion.ContentManager.CoreService.Client.LinkToSchemaData
        $item.MetadataSchema.IdRef = "tcm:0-0-0"
        $coreServiceClient.Update($item, $null)
        Write-Host "Updated item '$($item.Id)'"
    }
    else
    {
        Write-Warning "Item '$itemId' does not have a Metadata Schema set."
    }

}