Uploading HTML Design Configuration
===================================

This file serves as a handy guide to creating html design configurations for DXA.

All html module designs should exist in a folder with the folder name being the module name. You must make sure
you make this folder name identical to the one used in the CME. For example 'MediaManager'. 

Automated publishing
====================

Run MSBuild .\html-design\htmlToCms.proj

This will iterate through all the folders in \dxa-modules\html-design

The folder name is used to identify the module name. The contents of this folder should consist of the following
structure:
		src\
		src\system
		src\system\assets
		src\system\assets\scripts
		src\templates
		src\templates\pages
		src\templates\partials


\prebuild is excluded as this is used to store the scripts/assemblies required for automatic publishing.


Manual creation of HTML designs and publishing within the CME:
==============================================================
1) Create a multimedia component inside 100 Master/Building Blocks/Modules/<ModuleName>/Admin and upload the HTML design zip package. Make sure you use the ZIP File schema. You should ideally name this component '<modulename>-html-design'.

	1.1) The html design package inside the zip must be correctly structured like this:
		src\
		src\system
		src\system\assets
		src\system\assets\scripts
		src\templates
		src\templates\pages
		src\templates\partials
		
		To make sure all the scripts located in the src\system\assets\scripts folder are published correctly and individually a template is used that will register the scripts. An example would look like the following:
		
		Create a file src\templates\pagea\mediamanager.hbs with the following contents:
		
		---
		layout: src/templates/layouts/blank.hbs
		---
		<html lang="en">
		<head>
			<meta charset="utf-8" />
		</head>
		<body>	
			{{!-- MEDIAMANAGER --}}
			<!-- build:js(src) /system/assets/scripts/carousel.js -->
				<script src="/system/assets/scripts/carousel.js"></script>
			<!-- endbuild -->
			<!-- build:js(src) /system/assets/scripts/html5player.js -->
				<script src="/system/assets/scripts/html5player.js"></script>
			<!-- endbuild -->
			<!-- build:js(src) /system/assets/scripts/mmCustomEvents.js -->
				<script src="/system/assets/scripts/mmCustomEvents.js"></script>
			<!-- endbuild -->
			<!-- build:js(src) /system/assets/scripts/resolutionOverlay.js -->
				<script src="/system/assets/scripts/resolutionOverlay.js"></script>
			<!-- endbuild -->	
		</body>
		</html>
		
		if instead you wish to merge all the scripts into the main.js script then you can add a template to src\templates\partials\module-scripts-footer.hbs with 
		the following contents:
		
		{{!-- example footer scripts --}}
		<script src="/system/assets/scripts/html5player.js"></script>
		<script src="/system/assets/scripts/carousel.js"></script>
		<script src="/system/assets/scripts/resolutionOverlay.js"></script>
		<script src="/system/assets/scripts/mmCustomEvents.js"></script>

		
2) Create a new component inside 100 Master/Building Blocks/Settings/<ModuleName>/Site Manager called '<ModuleName> HTML Design Configuration'.

	2.1) Use schema 'HTML Design Configuration'
	2.2) Link to the previously uploaded html design zip package in the field 'HTML design (packaged in zip file)'.
	2.3) Specify version (i.e. 1.4). This will be used to generate a versioned url.
	
3) Create a new component inside 100 Master/Building Blocks/Modules/<ModuleName>/Site Manager called '<ModuleName>'.
	
	3.1) Use the schema 'Module Configuration'.
	3.2) Specify a version (i.e. 1.4, see 2.3)
	3.3) Link to the component created in (2) in the field 'HTML Design Configuration'
	
4) You can now publish your design configuration by publishing the component located at <Site>/Home/_Settings/Publish HTML Design

   notes: You should make sure all items are checked in (i.e. not locked) in order for the publishing to be successful.
      