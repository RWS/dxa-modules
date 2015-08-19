<#
.Synopsis
   Deploys SmartTarget module to web application
.DESCRIPTION
   Deploys SmartTarget module to web application
.EXAMPLE
   & '.\web-install.ps1' -distDestination "c:\inetpub\wwwroot\mysite" -distSmartTargetTempDir "C:\temp\smarttarget"
.INPUTS
   distDestination, distHostedEnvironment, 
   distIndexServerUrl, distIndexServerUsername, distIndexServerPassword, distIndexServerDeploymentLocation, distIndexServerDeploymentInstanceName
   distQueryServerUrl, distQueryServerUsername, distQueryServerPassword
   distSmartTargetTempDir,
.NOTES
   General notes
.COMPONENT
   The component this cmdlet belongs to
.ROLE
   The role this cmdlet belongs to
.FUNCTIONALITY
   The functionality that best describes this cmdlet
#>

[CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$false)]
Param(
    [Parameter(Mandatory=$true, HelpMessage="File system path of the root folder of DXA Website")]
    [string]$distDestination,

    [Parameter(Mandatory=$false, HelpMessage="Connecting to a hosted(/cloud) Fredhopper environment")]
    [string]$distHostedEnvironment,

    [Parameter(Mandatory=$true, HelpMessage="Provide the IndexServer Url")]
    [string]$distIndexServerUrl,

    [Parameter(Mandatory=$true, HelpMessage="Provide the Username of the IndexServer")]
    [string]$distIndexServerUsername,

    [Parameter(Mandatory=$true, HelpMessage="Provide the Password of the IndexServer")]
    [string]$distIndexServerPassword,

    [Parameter(Mandatory=$true, HelpMessage="Provide the Deployment location of the IndexServer")]
    [string]$distIndexServerDeploymentLocation,

    [Parameter(Mandatory=$true, HelpMessage="Provide the Deployment instance name of the IndexServer")]
    [string]$distIndexServerDeploymentInstanceName,

    [Parameter(Mandatory=$true, HelpMessage="Provide the QueryServer Url")]
    [string]$distQueryServerUrl,

    [Parameter(Mandatory=$true, HelpMessage="Provide the Username of the QueryServer")]
    [string]$distQueryServerUsername,

    [Parameter(Mandatory=$true, HelpMessage="Provide the Password of the QueryServer")]
    [string]$distQueryServerPassword,

    [Parameter(Mandatory=$false, HelpMessage="Provide the SmartTarget tempDir")]
    [string]$distSmartTargetTempDir
)

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

#Process 'WhatIf' and 'Confirm' options
if (!($pscmdlet.ShouldProcess("System", "Deploy SmartTarget module in web application"))) { return }

#Initialization
$IsInteractiveMode = !((gwmi -Class Win32_Process -Filter "ProcessID=$PID").commandline -match "-NonInteractive") -and !$NonInteractive

$distSource = (Resolve-Path (Join-Path (Split-Path $MyInvocation.MyCommand.Path) "web\")).Path

#Format data
$distSource = $distSource.TrimEnd("\")
$distDestination = $distDestination.TrimEnd("\")

#Copy files
Copy-Item $distSource\* $distDestination -Recurse -Force
Write-Output ("Copied views and DLLs for SmartTarget module.")

##Web.config
function AddSmartTargetModelBuilderToModelBuilderPipeline($value) 
{
    [xml]$doc = Get-Content $distDestination\Web.config -ErrorAction Stop
    $existing = $doc.SelectSingleNode("/configuration/modelBuilderPipeline/*[local-name()='add' and @type='" + $value + "']")

	if ($existing -ne $null)
	{
		Write-Output ("Web.config already contains '$value'")
	}
	else
	{ 
        $comment = $doc.CreateComment(" SmartTarget module ")
        $doc.configuration.modelBuilderPipeline.AppendChild($comment)

        $item = $doc.CreateElement("add")
		$item.SetAttribute("type", $value)
		$doc.configuration.modelBuilderPipeline.AppendChild($item)
		$doc.Save("$distDestination\Web.config")
    }

}

##cd_ambient_conf.xml
function AddSmartTargetCartridges($name, $value) 
{
    [xml]$doc = Get-Content $distDestination\bin\config\cd_ambient_conf.xml -ErrorAction Stop
    $existing = $doc.SelectSingleNode("/Configuration/Cartridges/*[local-name()='Cartridge' and @File='" + $value + "']")
    
    if ($existing -ne $null)
	{
		Write-Output ("cd_ambient_conf.xml already contains '$value'")
	}
    else 
    {
        $comment = $doc.CreateComment(" $name cartridge definition. ")
        $doc.Configuration.Cartridges.AppendChild($comment)

        $item = $doc.CreateElement("Cartridge")
        $item.SetAttribute("File", $value)
        $doc.Configuration.Cartridges.AppendChild($item)
        $doc.Save("$distDestination\bin\config\cd_ambient_conf.xml")
    }
}

##logback.xml
function AddSmartTargetLog($value) 
{
    [xml]$doc = Get-Content $distDestination\bin\config\logback.xml -ErrorAction Stop
    $existing = $doc.SelectSingleNode("/configuration/*[local-name()='appender' and @name='" + $value + "']")
    
    if ($existing -ne $null)
	{
		Write-Output ("logback.xml already contains '$value'")
	}
    else 
    {
        ## Appender
        $comment1 = $doc.CreateComment(" SmartTarget Appender ")
        $doc.configuration.AppendChild($comment1)

        $item = $doc.CreateElement("appender")
        $item.SetAttribute("name", $value)
        $item.SetAttribute("class", "ch.qos.logback.core.rolling.RollingFileAppender")
        
        #rollingpolicy
        $filenamepattern = $doc.CreateElement("fileNamePattern")
        $filenamepattern.InnerText = "`${log.folder}/smarttarget.%d{yyyy-MM-dd}.log"

        $maxhistory = $doc.CreateElement("maxHistory")
        $maxhistory.InnerText = "`${log.history}"
        
        $rollingpolicy = $doc.CreateElement("rollingPolicy")
        $rollingpolicy.SetAttribute("class", "ch.qos.logback.core.rolling.TimeBasedRollingPolicy")
        $rollingpolicy.AppendChild($filenamepattern)
        $rollingpolicy.AppendChild($maxhistory)

        #encoder
        $patern = $doc.CreateElement("patern")
        $patern.InnerText = "`${log.pattern}"
        
        $encoder = $doc.CreateElement("encoder")
        $encoder.AppendChild($patern)
        
        #prudent
        $prudent = $doc.CreateElement("prudent")
        $prudent.InnerText = "true"

        $item.AppendChild($rollingpolicy)
        $item.AppendChild($encoder)
        $item.AppendChild($prudent)

        $doc.configuration.AppendChild($item)
        
        ##Logger
        $commentLogger = $doc.CreateComment(" SmartTarget Logger ")
        $doc.configuration.AppendChild($commentLogger)

        $appenderAmbient = $doc.CreateElement("appender-ref")
        $appenderAmbient.SetAttribute("ref", "rollingSmartTargetLog")

        $loggerAmbient = $doc.CreateElement("logger")
        $loggerAmbient.SetAttribute("name", "com.tridion.smarttarget.ambientdata")
        $loggerAmbient.SetAttribute("level", "`${log.level}")
        $loggerAmbient.AppendChild($appenderAmbient)

        $doc.configuration.AppendChild($loggerAmbient)
        
        $appenderSmartTarget = $doc.CreateElement("appender-ref")
        $appenderSmartTarget.SetAttribute("ref", "rollingSmartTargetLog")

        $loggerSmartTarget = $doc.CreateElement("logger")
        $loggerSmartTarget.SetAttribute("name", "Tridion.SmartTarget")
        $loggerSmartTarget.SetAttribute("level", "`${log.level}")
        $loggerSmartTarget.AppendChild($appenderSmartTarget)

        $doc.configuration.AppendChild($loggerSmartTarget)
        $doc.Save("$distDestination\bin\config\logback.xml")
    }

}

##smarttarget_conf.xml
function AddSmartTargetConfiguration()
{
    [xml]$doc = Get-Content $distDestination\bin\config\smarttarget_conf.xml -ErrorAction Stop
    
    if ($distHostedEnvironment)
    {
        $doc.Configuration.Fredhopper.Hosted.Enable = "true"
        $doc.Configuration.Fredhopper.Hosted.Url = $distHostedEnvironment
    }

    ##IndexServer
    $doc.Configuration.Fredhopper.IndexServer.Url = $distIndexServerUrl
    $doc.Configuration.Fredhopper.IndexServer.Authentication.Username = $distIndexServerUsername
    $doc.Configuration.Fredhopper.IndexServer.Authentication.Password = $distIndexServerPassword  
    $doc.Configuration.Fredhopper.IndexServer.Deployment.Location = $distIndexServerDeploymentLocation
    $doc.Configuration.Fredhopper.IndexServer.Deployment.InstanceName = $distIndexServerDeploymentInstanceName

    ##QueryServer
    $doc.Configuration.Fredhopper.QueryServer.Url = $distQueryServerUrl
    $doc.Configuration.Fredhopper.QueryServer.Authentication.Username = $distQueryServerUsername
    $doc.Configuration.Fredhopper.QueryServer.Authentication.Password = $distQueryServerPassword  

    ##SmartTarget
    if ($distSmartTargetTempDir)
    {
        $doc.Configuration.SmartTarget.TempDir = $distSmartTargetTempDir
    }

    $doc.Save("$distDestination\bin\config\smarttarget_conf.xml")
}

AddSmartTargetModelBuilderToModelBuilderPipeline "Sdl.Web.Modules.SmartTarget.Mapping.SmartTargetModelBuilder, Sdl.Web.Modules.SmartTarget"

AddSmartTargetCartridges "SmartTarget" "/smarttarget_cartridge_conf.xml"
AddSmartTargetCartridges "Session" "/session_cartridge_conf.xml"

AddSmartTargetLog "rollingSmartTargetLog"

AddSmartTargetConfiguration
