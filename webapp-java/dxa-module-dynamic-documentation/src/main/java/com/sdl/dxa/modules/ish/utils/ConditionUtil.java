package com.sdl.dxa.modules.ish.utils;

import com.tridion.ambientdata.claimstore.DefaultClaimStore;
import com.tridion.ambientdata.configuration.CartridgeCategory;
import com.tridion.ambientdata.web.WebContext;

import java.net.URI;
import java.util.List;
import java.util.Map;

public class ConditionUtil {

    public static void addConditions(URI key, Map<String, List> conditions) {
        WebContext.setContext(new WebContext(CartridgeCategory.EMPTY_CATEGORY));
        if (WebContext.getCurrentClaimStore() == null) {
            WebContext.setCurrentClaimStore(new DefaultClaimStore());
        }
        if (conditions != null) {
            WebContext.getCurrentClaimStore().put(key, conditions);
        } else {
            WebContext.getCurrentClaimStore().remove(key);
        }
    }

}
