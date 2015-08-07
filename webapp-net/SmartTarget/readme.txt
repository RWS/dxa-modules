Add the SmartTargetModelBuilder to the modelBuilderPipeline in web.config of the Site solution:

  <modelBuilderPipeline>
    <add type="Sdl.Web.Tridion.Mapping.DefaultModelBuilder, Sdl.Web.Tridion"/>
    <!-- SmartTarget module -->
    <add type="Sdl.Web.Modules.SmartTarget.Mapping.SmartTargetModelBuilder, Sdl.Web.Modules.SmartTarget" />
  </modelBuilderPipeline>
  
Add the following Cartridges to cd_ambient_conf.xml:

	<Cartridge File="/smarttarget_cartridge_conf.xml" />
	<Cartridge File="/session_cartridge_conf.xml" />

Add smarttarget_referrers.xml to bin\config of the Site with the following content:

<?xml version="1.0"?>
<smarttarget>
	<referrers>
		<referrer name="Google">
			<![CDATA[.*google\.(?:[a-z\.]+)/search\?.*?q=([^&]+).*]]>
		</referrer>
		<referrer name="Yahoo">
			<![CDATA[.*yahoo\.(?:[a-z\.]+)/search\?.*?p=([^&]+).*]]>
		</referrer>
		<referrer name="Bing">
			<![CDATA[.*bing\.(?:[a-z\.]+)/search\?.*?q=([^&]+).*]]>
		</referrer>
		<referrer name="Altavista">
			<![CDATA[.*altavista\.(?:[a-z\.]+)/web/results\?.*?q=([^&]+).*]]>
		</referrer>
		<referrer name="local1">
			<![CDATA[.*examplesite/search\.jsp\?q=([^&]+).*]]>
		</referrer>
	</referrers>
</smarttarget>

Add smarttarget_conf.xml to bin\config of the Site with the following content:

<?xml version="1.0" encoding="UTF-8"?>
<Configuration Version="2.1">
    <Fredhopper>
		<!-- Default settings -->
		<DefaultUniverse>catalog01</DefaultUniverse>
		<DefaultLocale>en_US</DefaultLocale>

        <Hosted>
            <!-- Set to true if connecting to a hosted Fredhopper environment -->
            <Enable>false</Enable>
            <!-- Name of service instance when using the hosted environment -->
            <ServiceInstanceName>fas:live1</ServiceInstanceName>
            <!-- Endpoint for uploading data (deployment)-->
            <Url>https://my.eu1.fredhopperservices.com/</Url>
        </Hosted>

		<IndexServer>
            <!-- On premise Url -->
            <Url>http://saintjohn01.ams.dev:8180/</Url>
            <!-- Hosted url -->
            <!--<Url>http://bm.prepublished.live1.fas.eu1.fredhopperservices.com/</Url>-->
            <Authentication>
                <!--Note that the username/password for the Deployment Webservice and Index Server are combined here -->
                <!--If you're on premise and have authentication enabled on the index server they need to be the same as for the Deployment Webservice -->
                <Username>admin</Username>
                <Password>encrypted:56StnjmsTNnHdITMkL4KYw==</Password>
            </Authentication>

			<Deployment>
				<!-- Specifies where the deployer extension will place the files to be picked up by Fredhopper -->
				<Location>C:/Fredhopper/staging-indexer/data/fas-xml-incremental/catalog01</Location>
				<!-- Use this instead, if you have the SmartTarget Deployment WebService installed -->
				<!--
				<Location>http://localhost:8080/SmartTargetDeploymentWebService/SmartTargetDeploymentWebService?wsdl</Location>

				-->
                <InstanceName>staging-indexer</InstanceName>
                <KettleJobName>STJob.kjb</KettleJobName>
			</Deployment>

            <Timeouts>
                <BatchActions>30000</BatchActions>
                <Localization>5000</Localization>
                <Promotions>5000</Promotions>
                <Triggers>5000</Triggers>
                <Deployment>30000</Deployment> <!-- Only applies when Hosted is set to True-->
            </Timeouts>
		</IndexServer>
		
		<QueryServer>
            <!-- On premise Url -->
            <Url>http://saintjohn01.ams.dev:8180/</Url>
            <!-- Hosted url -->
            <!--<Url>http://query.published.live1.fas.eu1.fredhopperservices.com/</Url>-->
            <Authentication>
                <Username>admin</Username>
                <Password>encrypted:56StnjmsTNnHdITMkL4KYw==</Password>
            </Authentication>
            <Timeouts>
                <Query>20000</Query>
            </Timeouts>
		</QueryServer>
    </Fredhopper>
    <SmartTarget>
        <!-- Used to store temporary files -->
        <TempDir>c:\tridion\</TempDir>

        <!--
            Defines the offset in hours and minutes from this CD system to the CM system's local server time
            Used for begin and end dates of Experiments as well as date triggers
            Examples:
            -7 means the CM system is in a TimeZone 7 hours earlier than this CD system
            -7:45 means the CM system is in a TimeZone 7 hours and 45 minutes earlier than this CD system
            +5 means the CM system is in a TimeZone 5 hours later than this CD system
            +5:30 means the CM system is in a TimeZone 5 hours and 30 minutes later than this CD system
        -->
        <TimeZoneOffset>0</TimeZoneOffset>

        <!-- Analytics -->
        <Analytics implementationClass="com.tridion.smarttarget.analytics.google.GoogleAnalyticsManager" timeoutMilliseconds="5000" trackingRedirectUrl="/redirect/">
            <ServiceAccountEmailAddress></ServiceAccountEmailAddress>
            <PrivatekeyPath></PrivatekeyPath>
            <AccountId></AccountId>
            <TrackingId></TrackingId>
            <ViewId></ViewId>
            <CustomDimensions>
                <ExperimentId>dimension1</ExperimentId>
                <PublicationTargetId>dimension2</PublicationTargetId>
                <PublicationId>dimension3</PublicationId>
                <PageId>dimension4</PageId>
                <Region>dimension5</Region>
                <ComponentId>dimension6</ComponentId>
                <ComponentTemplateId>dimension7</ComponentTemplateId>
                <ChosenVariant>dimension8</ChosenVariant>
            </CustomDimensions>
        </Analytics>

        <!-- Prefixes for the output namespaces -->
        <Tcdl>
            <Prefix>
                <Java>smarttarget</Java>
                <DotNet>smarttarget</DotNet>
                <Jstl>
                    <Core>c</Core>
                </Jstl>
            </Prefix>

            <!-- TCDL Placeholders and replacements -->
			<Placeholder>
				<Pattern>##(.+?)##</Pattern>
				<Replace>
					<DotNet>
						<Query><![CDATA[<%# Eval(&quot;$1&quot;) %>]]></Query>
						<!-- configuration for deprecated controls. left for backward compatibility -->
						<ItemContentInfo><![CDATA[<%# ((ItemContent)Container.Parent).$1 %>]]></ItemContentInfo>
						<!-- end deprecated -->
						<ItemsHeader><![CDATA[<%# ((Items)Container.Parent).$1 %>]]></ItemsHeader>
						<NavigationSection><![CDATA[<%#((NavigationSection)Container.Parent).$1 %>]]></NavigationSection>
					</DotNet>
					<Java>
						<Query>\${item.$1}</Query>
						<!-- configuration for deprecated tags. left for backward compatibility -->
						<ItemContent>\${searchResult.$1}</ItemContent>
						<ItemContentInfo>\${$1}</ItemContentInfo>
						<!-- end deprecated -->
						<Items>\${searchResult.$1}</Items>
						<ItemsHeader>\${$1}</ItemsHeader>
						<NavigationSection><![CDATA[<c:out value="\${section.$1}" />]]></NavigationSection>
					</Java>
					<Rel>
						<Default>#{$1}</Default>
						<ComponentPresentation>#{item.$1}</ComponentPresentation>
						<NavigationSection>#{section.$1}</NavigationSection>
						<NavigationSectionHeader>#{section.$1}</NavigationSectionHeader>
						<NavigationSectionFooter>#{section.$1}</NavigationSectionFooter>
						<NavigationLink>#{link.$1}</NavigationLink>
						<ItemTemplate>#{item.$1}</ItemTemplate>
					</Rel>
				</Replace>
			</Placeholder>

            <!-- TCDL Output handlers (they need to implement the com.tridion.smarttarget.tcdl.OutputHandler interface) -->
            <OutputHandlers>com.tridion.smarttarget.tcdl.JavaTagOutputHandler,com.tridion.smarttarget.tcdl.DotNetServerControlOutputHandler</OutputHandlers>
        </Tcdl>
		
        <DefaultValues>
            <!-- Site-wide default for the "Allow duplicates across regions" option -->
            <AllowDuplicates>true</AllowDuplicates>
        </DefaultValues>

        <!-- The path to SmartTarget referrers definition file -->
        <Referrers>smarttarget.referrers.xml</Referrers>
		
        <!-- Ambient Data Framework prefixes (changes the long claim URIs of the framework into the shorter prefixes used in trigger-types.xml)-->
        <AmbientData>
            <Prefixes>
                <taf_claim_audiencemanager_contact>am</taf_claim_audiencemanager_contact>
                <taf_claim_audiencemanager_contact_extendeddetail>am_ex</taf_claim_audiencemanager_contact_extendeddetail>
                <taf_claim_ambientdata_sessioncartridge>sc</taf_claim_ambientdata_sessioncartridge>
                <taf_claim_ambientdata_sessioncartridge_session>sc_session</taf_claim_ambientdata_sessioncartridge_session>
                <taf_claim_ambientdata_sessioncartridge_useragent>sc_ua</taf_claim_ambientdata_sessioncartridge_useragent>
                <taf_claim_ambientdata_sessioncartridge_useragent_browser>sc_ua_browser</taf_claim_ambientdata_sessioncartridge_useragent_browser>
                <taf_claim_ambientdata_sessioncartridge_useragent_os>sc_ua_os</taf_claim_ambientdata_sessioncartridge_useragent_os>
                <taf_claim_ambientdata_sessioncartridge_authorization>sc_auth</taf_claim_ambientdata_sessioncartridge_authorization>
            </Prefixes>
            <!-- Add SmartTarget data to the ClaimStore, so that other systems, like the Online Marketing Explorer, can use this information -->
            <AddSmartTargetDataToClaimStore>true</AddSmartTargetDataToClaimStore>
        </AmbientData>

        <!--  Exclude schema fields section -->
        <!--
        Exclude fields by specifying the field type and xmlname in each Schema section, use
        Field for a normal field or fields from embedded schema's for all schema's it is used in,
        MetadataField for a metadata field
        EmbeddedField for a field in an embedded schema (Note that the exclusion is only for the schema its embedded into), and
        EmbeddedMetadataField for a field in an embedded schema embedded as metadata
        -->
        <!--
        <ExcludeFields>
            <Schema Uri="tcm:1-1-8">
                <Field>orderdescription</Field>
                <MetadataField>referer</MetadataField>
                <EmbeddedField SchemaFieldName="billingaddress">street</EmbeddedField>
                <EmbeddedMetadataField SchemaFieldName="customer">name</EmbeddedField>
            </Schema>
        </ExcludeFields>
        -->

        <!-- Maps publications to user defined names -->
        <!--
        <ShortPublicationName>
            <Publication Uri="tcm:0-3-1">en</Publication>
            <Publication Uri="tcm:0-4-1">de</Publication>
        </ShortPublicationName>
        -->

        <!-- Regions used in the SmartTarget Region Trigger-type -->
        <Regions>
            <Region>Header</Region>
            <Region>Footer</Region>
            <Region>Sidebar</Region>
            <Region>Example1</Region>
            <Region>Example2</Region>
        </Regions>
    </SmartTarget>
</Configuration>