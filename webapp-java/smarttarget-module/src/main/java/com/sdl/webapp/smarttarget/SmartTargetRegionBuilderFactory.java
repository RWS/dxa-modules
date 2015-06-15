package com.sdl.webapp.smarttarget;

import com.sdl.webapp.common.api.DefaultImplementation;
import com.sdl.webapp.common.api.content.ContentProvider;
import com.sdl.webapp.common.api.content.RegionBuilder;
import com.sdl.webapp.tridion.xpm.XpmRegionConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 * SmartTargetRegionBuilderFactory
 *
 * @author nic
 */
@Component
public class SmartTargetRegionBuilderFactory {

    @Autowired
    private SmartTargetService smartTargetService;

    @Autowired
    private XpmRegionConfig xpmRegionConfig;

    @Autowired
    private ContentProvider contentProvider;

    @Autowired
    @Qualifier("defaultRegionBuilder")
    private DefaultImplementation<RegionBuilder> defaultImplementation;

    @Value("${smarttarget.enabled}")
    private boolean enabled = true;

    @PostConstruct
    public void createRegionBuilder() {

        if ( enabled ) {
            RegionBuilder regionBuilder = new SmartTargetRegionBuilder(smartTargetService, xpmRegionConfig, contentProvider);
            defaultImplementation.override(regionBuilder);
        }
    }

}
