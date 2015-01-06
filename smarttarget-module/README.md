SmartTarget Module
========================

## Setup

1. Install the CMS module by importing the Content Porter package in the 'cms' directory.
2. Setup your webapp with needed configuration (smarttarget_conf.xml, cd_ambient_conf.xml etc). Please refer to the standard [SmartTarget online documentation](http://docs.sdl.com/LiveContent/web/pub.xql?c=t&action=home&pub=SDL_SmartTarget_2014_SP1-v1&lang=en-US) for further information.
3. Make sure that you are using the SmartTarget specific region builder in your Spring context instead of the default TRI region builder:

        <bean id="regionBuilder" class="com.sdl.webapp.smarttarget.SmartTargetRegionBuilder"/>


## Templating

To create dynamic component presentations to be served by SmartTarget you have to add the following building blocks to your component template (in below order):

* Render Component Content
* Add to SmartTarget
* Default Component Template Finish Actions
* Generate Component Presentation

See the example component template '/Building Blocks/Modules/SmartTarget/Editor/Templates/PromoBanner [Hero]' for a working example.

The SmartTarget regions are implicit, i.e. no additional templating coding is required to make a specific TRI region to a SmartTarget region.
You only have to specify what regions (separated by comma) that are managed by SmartTarget in the page template metadata field 'SmartTarget Region Names'.
Use the metadata schema 'SmartTarget Page Template Metadata' instead of the standard TRI one.

## Design

The SmartTarget module requires that a specific region builder (SmartTargetRegionBuilder) is used than the default one. It will populate configured TRI regions with SmartTarget content on pages instead of using page component presentations.
If the SmartTarget query return an empty list the fallback content is used (the content using templates marked for current region) instead.
What regions that are managed by SmartTarget is specified by the the page template metadata field 'smartTargetRegionNames'.
Only results having component templates defined in the XPM region data are used in the region.
