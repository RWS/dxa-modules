package com.sdl.webapp.smarttarget;

import com.google.common.base.Strings;
import com.sdl.webapp.common.api.content.ContentProvider;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.content.RegionBuilder;
import com.sdl.webapp.common.api.content.RegionBuilderCallback;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.Entity;
import com.sdl.webapp.common.api.model.Page;
import com.sdl.webapp.common.api.model.Region;
import com.sdl.webapp.common.api.model.region.RegionImpl;
import com.sdl.webapp.tridion.xpm.ComponentType;
import com.sdl.webapp.tridion.xpm.XpmRegion;
import com.sdl.webapp.tridion.xpm.XpmRegionConfig;
import com.tridion.smarttarget.SmartTargetException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * SmartTarget Region Builder
 *
 * @author nic
 */
public class SmartTargetRegionBuilder implements RegionBuilder {

    private static final Logger LOG = LoggerFactory.getLogger(SmartTargetRegionBuilder.class);

    @Autowired
    private XpmRegionConfig xpmRegionConfig;

    @Autowired
    private SmartTargetService smartTargetService;

    @Autowired
    private ContentProvider contentProvider;


    @Override
    public Map<String, Region> buildRegions(Page page,
                                            List<?> sourceList,
                                            RegionBuilderCallback callback,
                                            Localization localization) throws ContentProviderException {

        Map<String,Region> regions = new HashMap<>();

        this.populateSmartTargetRegions(page, regions, localization);

        for (Object source : sourceList) {
            final Entity entity = callback.buildEntity(source, localization);

            String regionName = callback.getRegionName(source);
            if (!Strings.isNullOrEmpty(regionName)) {

                RegionImpl region = (RegionImpl) regions.get(regionName);
                if (region == null) {
                    LOG.debug("Creating region: {}", regionName);
                    region = new RegionImpl();
                    region.setName(regionName);
                    region.setMvcData(callback.getRegionMvcData(source));
                    regions.put(regionName, region);
                }

                if ( region instanceof SmartTargetRegion ) {
                    SmartTargetRegion stRegion = (SmartTargetRegion) region;
                    if ( stRegion.containsSmartTargetContent() == false )
                    // If no data populated from SmartTarget -> Add fallback content to the region
                    //
                    region.addEntity(entity);

                }
                else {
                    region.addEntity(entity);
                }
            }
        }
        return regions;

    }

    private void populateSmartTargetRegions(Page page, Map<String,Region> regions, Localization localization) throws ContentProviderException {

        List<SmartTargetRegionConfig> smartTargetRegionConfigList = this.getSmartTargetRegionConfiguration(page);
        if ( smartTargetRegionConfigList == null ) return;


        for (SmartTargetRegionConfig regionConfig : smartTargetRegionConfigList) {
            SmartTargetRegion stRegion = new SmartTargetRegion();
            stRegion.setName(regionConfig.getRegionName());
            stRegion.setMvcData(new SmartTargetRegionMvcData(regionConfig.getRegionName()));
            regions.put(regionConfig.getRegionName(), stRegion);
            XpmRegion xpmRegion = xpmRegionConfig.getXpmRegion(regionConfig.getRegionName(), localization);
            try {

                List<SmartTargetComponentPresentation> stComponentPresentations =
                    this.smartTargetService.query(page.getId(),
                                                  regionConfig,
                                                  this.getComponentTemplates(xpmRegion));

                if ( stComponentPresentations.size() > 0 ) {
                    stRegion.setContainsSmartTargetContent(true);
                }
                for ( SmartTargetComponentPresentation stComponentPresentation : stComponentPresentations ) {
                    Entity entity = contentProvider.getEntityModel(stComponentPresentation.getComponentUri(),
                                                                   stComponentPresentation.getTemplateUri(),
                                                                   localization);
                    stRegion.addEntity(entity);
                }

            }
            catch ( SmartTargetException e  ) {
                LOG.error("Could not populate SmartTarget region '" + regionConfig.getRegionName() + "'", e);
            }
        }

    }

    private List<SmartTargetRegionConfig> getSmartTargetRegionConfiguration(Page page) {
        List<Map<String,String>> smartTargetRegionConfig = (List<Map<String,String>>) page.getMvcData().getMetadata().get("smartTargetRegions");
        if ( smartTargetRegionConfig == null ) return null;

        List<SmartTargetRegionConfig> configList = new ArrayList<>();
        for ( Map<String,String> regionConfig : smartTargetRegionConfig ) {
            configList.add(new SmartTargetRegionConfig(regionConfig));
        }
        return configList;
    }

    private List<String> getComponentTemplates(XpmRegion xpmRegion) {
        List<String> componentTemplates = new ArrayList<>();
        for (ComponentType componentType : xpmRegion.getComponentTypes() ) {
            componentTemplates.add(componentType.getTemplateId());
        }
        return componentTemplates;
    }

}
