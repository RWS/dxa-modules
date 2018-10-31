Param (
    [ValidateSet("Prepare", "Push")]
    [string[]] $Actions = @("Prepare", "Push"),

    [Parameter(Mandatory = $false)]
    [string] $guiSourcePath = "..\",

    [Parameter(Mandatory = $false)]
    [string]$nexusSource = "https://nexus.sdl.com/service/local/nuget/releases_dotnet/",

    [Parameter(Mandatory = $false)]
    [string]$nuGetApiKey = "4e428671-39c7-3bcf-a955-a0a1af81fed8",

    [Parameter(Mandatory = $false)]
    [string]$packageName = "Sdl.Dxa.Modules.DynamicDocumentation.Boilerplate",

    [Parameter(Mandatory = $false)]
    [string]$tempFolder = ".\temp",

    [Parameter(Mandatory = $false)]
    [string]$version = "2.1.0",

    [Parameter(Mandatory = $false)]
    [boolean]$isPreRelease = $true
)
#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

# Import utils
. ".\nuget-utils.ps1"

$timestamp = (Get-Date).ToUniversalTime().ToString("yyyyMMddHHmmss")

$packageVersion = "$version-$timestamp"

if($isPreRelease) {
    $packageVersion = "$version-beta-$timestamp"
}

$packageRoot = "$tempFolder\package"
$packageTargetFile = "$packageRoot\$packageName.$packageVersion.nupkg"
$packageTempPath = "$packageRoot\$packageName"

# Prepare package. Copy needed files to $targetPackagePath and pack it
if ($Actions -contains "Prepare")
{
    Write-Host "Preparing NuGet package we are going to publish.";

    if (!(Test-Path -Path "$tempFolder")) {
        Write-Host "Folder $tempFolder doesn't exist. Creating...";
        New-Item -Path $tempFolder -ItemType Directory | Out-Null;
    }

    Write-Host "Cleaning $packageRoot folder.";
    if (Test-Path -Path "$packageRoot")
    {

        Remove-Item -Path "$packageRoot" -Recurse -Force;
        Write-Host "Folder $packageRoot has been removed";
    }
    else
    {
        New-Item -Path $packageRoot -ItemType Directory | Out-Null
    }

    New-Item -Path $packageTempPath -ItemType Directory | Out-Null

    $packageContentFolder = "$packageTempPath\content\gui"
    Write-Host "Creating folder $packageContentFolder.";
    New-Item -Path "$packageContentFolder" -ItemType Directory | Out-Null;
    Write-Host "Folder $packageContentFolder has been created.";

    Write-Host "Copying GUI artifacts to $packageContentFolder...";

    Copy-Item -Path "$guiSourcePath\*" -Destination "$packageContentFolder" -Exclude @("nuget","target","assembly","dynamic-documentation-boilerplate.iml") -Recurse
    Copy-Item -Path ".\$packageName.nuspec" -Destination "$packageTempPath"

    Pack-Package -nuspecFilePath "$packageTempPath\$packageName.nuspec" -packageVersion $packageVersion -outputPath "$packageRoot";
}

# Push it to nexus
if ($Actions -contains "Push")
{
    Push-Package -packagePath $packageTargetFile -nuGetApiKey $nuGetApiKey -nexusSource $nexusSource
}

