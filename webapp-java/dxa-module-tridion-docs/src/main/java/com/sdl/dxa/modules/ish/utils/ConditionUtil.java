package com.sdl.dxa.modules.ish.utils;

import com.tridion.ambientdata.claimstore.DefaultClaimStore;
import com.tridion.ambientdata.configuration.CartridgeCategory;
import com.tridion.ambientdata.web.WebContext;

import java.net.URI;

public class ConditionUtil {

    public static void addConditions(URI key, String conditions) {
        if (WebContext.getContext() == null) {
            WebContext.setContext(new WebContext(CartridgeCategory.EMPTY_CATEGORY));
        }
        if (WebContext.getCurrentClaimStore() == null) {
            WebContext.setCurrentClaimStore(new DefaultClaimStore());
        }
        WebContext.getCurrentClaimStore().put(key, conditions);
    }

}
