#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

$path = Join-Path $env:TRIDION_HOME "bin\cm_xml_usr.xsd"

Write-Host "Modifying xml schema to allow international characters..."
[xml]$config = Get-Content $path
$element = $config.schema.simpleType | where {$_.name -eq "FileName"}
$element.restriction.pattern.SetAttribute("value", ".+")
$config.Save($path)

Write-Host "Restarting service ..."
Restart-Service -Name TcmServiceHost -Verbose -Force
