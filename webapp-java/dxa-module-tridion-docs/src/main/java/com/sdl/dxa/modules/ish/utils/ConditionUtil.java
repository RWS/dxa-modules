package com.sdl.dxa.modules.ish.utils;

import com.tridion.ambientdata.claimstore.DefaultClaimStore;
import com.tridion.ambientdata.configuration.CartridgeCategory;
import com.tridion.ambientdata.web.WebContext;
import org.apache.commons.lang3.StringUtils;

import java.net.URI;

public class ConditionUtil {

    public static void addConditions(URI key, String conditions) {
        WebContext.setContext(new WebContext(CartridgeCategory.EMPTY_CATEGORY));
        if (WebContext.getCurrentClaimStore() == null) {
            WebContext.setCurrentClaimStore(new DefaultClaimStore());
        }
        if (StringUtils.isNotEmpty(conditions)) {
            WebContext.getCurrentClaimStore().put(key, conditions);
        } else {
            WebContext.getCurrentClaimStore().remove(key);
        }
    }

}
