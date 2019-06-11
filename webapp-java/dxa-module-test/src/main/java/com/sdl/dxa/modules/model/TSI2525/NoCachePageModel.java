package com.sdl.dxa.modules.model.TSI2525;

import com.sdl.dxa.caching.NeverCached;
import com.sdl.dxa.caching.NoOutputCache;
import com.sdl.webapp.common.api.model.page.DefaultPageModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@NoOutputCache
@NeverCached
public class NoCachePageModel extends DefaultPageModel {

    public NoCachePageModel() throws ClassNotFoundException {
        TestCacheListenerExtender.registerListeners();
    }
}
