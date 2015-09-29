<#
.SYNOPSIS
   Performs Smart Target module deployment actions for Continuous Integration environment
#>

[CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$false)]
Param(
    [Parameter(Mandatory=$true, HelpMessage="File system path of the root folder of DXA Website")]
    [string]$distDestination
)

#Terminate script on first occurred exception
$ErrorActionPreference = "Stop"

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

AddSmartTargetModelBuilderToModelBuilderPipeline "Sdl.Web.Modules.SmartTarget.Mapping.SmartTargetModelBuilder, Sdl.Web.Modules.SmartTarget"
