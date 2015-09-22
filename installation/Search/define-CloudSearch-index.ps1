<#
.Synopsis
   Defines the CloudSearch Index fields used by the DXA Search Module.
.DESCRIPTION
   Defines the CloudSearch Index fields used by the DXA Search Module.
.EXAMPLE
   & '.\define-CloudSearch-index.ps1' my-cloudsearch-domain 
#>

[CmdletBinding( SupportsShouldProcess=$true, PositionalBinding=$true)]
Param(
    [Parameter(Mandatory=$true, HelpMessage="The name of the AWS CloudSearch domain.")]
    [string]$domain
)

aws cloudsearch define-index-field --domain $domain --name id --type text
aws cloudsearch define-index-field --domain $domain --name url --type text
aws cloudsearch define-index-field --domain $domain --name pubdate --type date
aws cloudsearch define-index-field --domain $domain --name title --type text
aws cloudsearch define-index-field --domain $domain --name publicationid --type int
aws cloudsearch define-index-field --domain $domain --name schemaid --type int
aws cloudsearch define-index-field --domain $domain --name itemtype --type int
aws cloudsearch define-index-field --domain $domain --name parentsgid --type int
aws cloudsearch define-index-field --domain $domain --name sgid --type int
aws cloudsearch define-index-field --domain $domain --name type --type int
aws cloudsearch define-index-field --domain $domain --name body --type text
aws cloudsearch define-index-field --domain $domain --name summary --type text
aws cloudsearch define-index-field --domain $domain --name version --type double
aws cloudsearch define-index-field --domain $domain --name filetype --type text
aws cloudsearch define-index-field --domain $domain --name filesize --type text

aws cloudsearch index-documents --domain-name $domain
