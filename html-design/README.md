Uploading HTML Design Configuration
===================================

This file serves as a handy guide to creating html design configurations for DXA.

TODO: 
This is an initial guide in creating and publishing html designs. More details will be added soon based on if you want 
CSS, merged scripts or individual scripts published. Also we should automate this process by automatically zipping the
html-design artifacts and using Core Services to upload the design package.


Manual creation of HTML designs and publishing within the CME:
==============================================================
1) Create a multimedia component inside 100 Master/Building Blocks/Modules/<ModuleName>/Admin and upload the HTML design zip package. Make sure 
you use the ZIP File schema. You should ideally name this component '<modulename>-html-design'.

	1.1) The html design package inside the zip must be correctly structured like this:
		src\
		src\system
		src\system\assets
		src\system\assets\scripts
		src\templates
		src\templates\pages
		src\templates\partials
		
		To make sure all the scripts located in the src\system\assets\scripts folder are published correctly a template is used
		that will register the scripts. An example would look like the following:
		
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
      