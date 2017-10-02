package com.sdl.dxa.modules.context.builder;

import com.sdl.dxa.api.datamodel.model.ContentModelData;
import com.sdl.dxa.api.datamodel.model.EntityModelData;
import com.sdl.dxa.api.datamodel.model.util.ListWrapper;
import com.sdl.dxa.caching.LocalizationAwareCacheKey;
import com.sdl.dxa.caching.wrapper.EntitiesCache;
import com.sdl.dxa.modules.context.model.Conditions;
import com.sdl.dxa.tridion.mapping.EntityModelBuilder;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.exceptions.DxaException;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

import static com.google.common.collect.Sets.newHashSet;

@Component
@Slf4j
public class ContextExpressionModelBuilder implements EntityModelBuilder, Ordered {

    private final EntitiesCache entitiesCache;

    @Value("${dxa.modules.contextexpr.extension_data_map_key}")
    private String contextExpressionsKey = "ContextExpressions";

    @Autowired
    public ContextExpressionModelBuilder(EntitiesCache entitiesCache) {
        this.entitiesCache = entitiesCache;
    }

    @Override
    public <T extends EntityModel> T buildEntityModel(@Nullable T originalEntityModel, EntityModelData modelData, @Nullable Class<T> expectedClass) throws DxaException {
        log.trace("Context expression model builder for EMD {}, entity {} and expectedClass {}", modelData, originalEntityModel, expectedClass);
        Map<String, Object> modelExtensionData = modelData.getExtensionData();

        if (modelExtensionData == null || !modelExtensionData.containsKey(contextExpressionsKey)) {
            log.debug("ContextExpressions not found in {}", modelData);
            return originalEntityModel;

        }

        ContentModelData cxExtensionData = (ContentModelData) modelExtensionData.get(contextExpressionsKey);
        String includeKey = "Include";
        String excludeKey = "Exclude";

        if (cxExtensionData == null || (!cxExtensionData.containsKey(includeKey) && !cxExtensionData.containsKey(excludeKey))) {
            log.debug("ContextExpressions section is empty in {}", modelData);
            return originalEntityModel;
        }

        LocalizationAwareCacheKey cacheKey = entitiesCache.getSpecificKey(modelData);
        if (entitiesCache.containsKey(cacheKey)) {
            //noinspection unchecked
            T modelInCache = (T) entitiesCache.get(cacheKey);
            if (hasAlreadyPassed(modelInCache)) {
                return modelInCache;
            }
        }

        //noinspection unchecked
        return (T) entitiesCache.addAndGet(cacheKey,
                applyConditions(originalEntityModel,
                        getConditions(cxExtensionData, includeKey),
                        getConditions(cxExtensionData, excludeKey)));
    }

    @Override
    public int getOrder() {
        return 0;
    }

    @NotNull
    private <T extends EntityModel> T applyConditions(T originalEntityModel, Collection<String> includeCx, Collection<String> excludeCx) {
        Conditions conditions = new Conditions(newHashSet(includeCx), newHashSet(excludeCx));

        log.debug("Found these context expressions {}", conditions);

        originalEntityModel.addExtensionData(contextExpressionsKey, conditions);

        return originalEntityModel;
    }

    private <T extends EntityModel> boolean hasAlreadyPassed(T originalEntityModel) {
        Map<String, Object> extensionData = originalEntityModel.getExtensionData();

        return extensionData != null && !extensionData.isEmpty() && extensionData.get(contextExpressionsKey) instanceof Conditions;
    }

    //cast is not type safe but we only expect there a ListWrapper of Strings, so let's pretend
    @SuppressWarnings("unchecked")
    private Collection<String> getConditions(Map<String, Object> extensionData, String key) {
        if (!extensionData.containsKey(key)) {
            log.trace("No values for {}", key);
            return Collections.emptyList();
        }
        Object cxValue = extensionData.get(key);
        if (cxValue instanceof String) {
            return Collections.singletonList((String) cxValue);
        } else if (cxValue instanceof ListWrapper && !((ListWrapper) cxValue).empty() && ((ListWrapper) cxValue).get(0) instanceof String) {
            return ((ListWrapper<String>) cxValue).getValues();
        } else {
            log.warn("Found something unexpected in CX: {} for key {}, returning empty collection", cxValue, key);
            return Collections.emptyList();
        }
    }
}
