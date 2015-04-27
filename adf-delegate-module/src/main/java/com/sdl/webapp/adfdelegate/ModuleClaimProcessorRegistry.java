package com.sdl.webapp.adfdelegate;

import com.tridion.ambientdata.processing.ClaimProcessor;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Collection;
import java.util.Hashtable;
import java.util.Map;

/**
 * ModuleClaimProcessorRegistry
 *
 * @author nic
 */
@Component
public class ModuleClaimProcessorRegistry {


    private static ModuleClaimProcessorRegistry _instance = null;

    private Map<String, ClaimProcessor> moduleProcessors = new Hashtable<>();

    /**
     * Get current instance of the registry. Is package protected to prevent use from other modules.
     * @return instance
     */
    static ModuleClaimProcessorRegistry instance() {
        return _instance;
    }

    @PostConstruct
    public void initialize() {
        _instance = this;
    }

    public synchronized void registerModuleClaimProcessor(ClaimProcessor claimProcessor) {

        String processorClassName = claimProcessor.getClass().getName();
        moduleProcessors.put(processorClassName, claimProcessor);

    }

    public synchronized void unregisterModuleClaimProcessor(ClaimProcessor claimProcessor) {
        moduleProcessors.remove(claimProcessor.getClass().getName());
    }

    public Collection<ClaimProcessor> getModuleProcessors() {
        return moduleProcessors.values();
    }


}
