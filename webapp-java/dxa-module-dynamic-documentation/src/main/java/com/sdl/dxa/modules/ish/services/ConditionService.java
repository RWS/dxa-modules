package com.sdl.dxa.modules.ish.services;

import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.exceptions.DxaItemNotFoundException;

import java.io.IOException;
import java.util.Map;

public interface ConditionService {
    String getConditions(Integer publicationId, Localization localization);
    Map<String, Map> getObjectConditions(int publicationId, Localization localization) throws DxaItemNotFoundException, IOException;
}
