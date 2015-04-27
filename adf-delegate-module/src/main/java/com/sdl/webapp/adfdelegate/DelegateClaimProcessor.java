package com.sdl.webapp.adfdelegate;

import com.tridion.ambientdata.AmbientDataException;
import com.tridion.ambientdata.claimstore.ClaimStore;
import com.tridion.ambientdata.processing.AbstractClaimProcessor;
import com.tridion.ambientdata.processing.ClaimProcessor;


/**
 * Delegate Claim Processor
 * - Invoked registered claim processors (normally defined in pluggable modules)
 *
 * @author nic
 */
public class DelegateClaimProcessor extends AbstractClaimProcessor {


    @Override
    public void onRequestStart(ClaimStore claimStore) throws AmbientDataException {

        if ( ModuleClaimProcessorRegistry.instance() != null ) {
            for (ClaimProcessor claimProcessor : ModuleClaimProcessorRegistry.instance().getModuleProcessors()) {
                claimProcessor.onRequestStart(claimStore);
            }
        }
    }

    @Override
    public void onRequestEnd(ClaimStore claimStore) throws AmbientDataException {
        if ( ModuleClaimProcessorRegistry.instance() != null ) {
            for (ClaimProcessor claimProcessor : ModuleClaimProcessorRegistry.instance().getModuleProcessors()) {
                claimProcessor.onRequestEnd(claimStore);
            }
        }
    }

    @Override
    public void onSessionStart(ClaimStore claimStore) throws AmbientDataException {
        if ( ModuleClaimProcessorRegistry.instance() != null ) {
            for (ClaimProcessor claimProcessor : ModuleClaimProcessorRegistry.instance().getModuleProcessors()) {
                claimProcessor.onSessionStart(claimStore);
            }
        }
    }
}