package com.sdl.webapp.adfdelegate;

import com.tridion.ambientdata.processing.AbstractClaimProcessor;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

/**
 * AbstractDelegateeClaimProcessor
 *
 * @author nic
 */
public abstract class AbstractDelegateeClaimProcessor extends AbstractClaimProcessor {

    @Autowired
    private ModuleClaimProcessorRegistry moduleClaimProcessorRegistry;

    @PostConstruct
    public void initialize() {
        this.moduleClaimProcessorRegistry.registerModuleClaimProcessor(this);
    }

    @PreDestroy
    public void teardown() {
        this.moduleClaimProcessorRegistry.unregisterModuleClaimProcessor(this);
    }
}
