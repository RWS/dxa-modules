package com.sdl.dxa.modules.context.builder;

import com.sdl.dxa.api.datamodel.model.EntityModelData;
import com.sdl.dxa.api.datamodel.model.util.ListWrapper;
import com.sdl.dxa.modules.context.model.Conditions;
import com.sdl.dxa.tridion.mapping.EntityModelBuilder;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.exceptions.DxaException;
import com.sdl.webapp.tridion.mapping.EntityBuilder;
import lombok.extern.slf4j.Slf4j;
import org.dd4t.contentmodel.Component;
import org.dd4t.contentmodel.ComponentPresentation;
import org.dd4t.contentmodel.Field;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Value;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

import static com.google.common.collect.Sets.newHashSet;
import static com.sdl.webapp.util.dd4t.FieldUtils.getStringValues;

@org.springframework.stereotype.Component
@Slf4j
public class ContextExpressionModelBuilder implements EntityBuilder, EntityModelBuilder {

    @Value("${dxa.modules.contextexpr.extension_data_map_key}")
    private String contextExpressionsKey = "ContextExpressions";

    @Value("${dxa.modules.contextexpr.r2.extension_data_map_key}")
    private String cxKeyR2 = "CX";

    @Override
    public <T extends EntityModel> T createEntity(ComponentPresentation componentPresentation, T originalEntityModel, Localization localization) throws ContentProviderException {
        log.trace("Context expression model builder for CP {}, entity {} and localization {}", componentPresentation, originalEntityModel, localization);

        if (componentPresentation.getExtensionData() == null
                || !componentPresentation.getExtensionData().containsKey(contextExpressionsKey)) {
            log.debug("ContextExpressions not found in {}", componentPresentation);
            return originalEntityModel;
        }

        Map<String, Field> content = componentPresentation.getExtensionData().get(contextExpressionsKey).getContent();

        return applyConditions(originalEntityModel, getStringValues(content.get("Include")), getStringValues(content.get("Exclude")));
    }


    @Override
    public <T extends EntityModel> T createEntity(Component component, T originalEntityModel, Localization localization) throws ContentProviderException {
        return originalEntityModel;
    }

    @Override
    public <T extends EntityModel> T createEntity(Component component, T originalEntityModel, Localization localization, Class<T> entityClass) throws ContentProviderException {
        return originalEntityModel;
    }

    @NotNull
    private <T extends EntityModel> T applyConditions(T originalEntityModel, Collection<String> includeCx, Collection<String> excludeCx) {
        Conditions conditions = new Conditions(newHashSet(includeCx), newHashSet(excludeCx));

        log.debug("Found these context expressions {}", conditions);

        originalEntityModel.addExtensionData(contextExpressionsKey, conditions);

        return originalEntityModel;
    }

    @Override
    public int getOrder() {
        return 0;
    }

    @Override
    public <T extends EntityModel> T buildEntityModel(@Nullable T originalEntityModel, EntityModelData modelData, @Nullable Class<T> expectedClass) throws DxaException {
        log.trace("Context expression model builder for EMD {}, entity {} and expectedClass {}", modelData, originalEntityModel, expectedClass);

        String includeKey = cxKeyR2 + ".Include";
        String excludeKey = cxKeyR2 + ".Exclude";

        Map<String, Object> extensionData = modelData.getExtensionData();
        if (extensionData == null || (!extensionData.containsKey(includeKey) && !extensionData.containsKey(excludeKey))) {
            log.debug("ContextExpressions not found in {}", modelData);
            return originalEntityModel;
        }

        //noinspection unchecked
        return applyConditions(originalEntityModel, getConditions(extensionData, includeKey), getConditions(extensionData, excludeKey));
    }

    //cast is not type safe but we only expect there a ListWrapper of Strings, so let's pretend
    @SuppressWarnings("unchecked")
    private Collection<String> getConditions(Map<String, Object> extensionData, String key) {
        return extensionData.containsKey(key) ? ((ListWrapper<String>) extensionData.get(key)).getValues() : Collections.emptyList();
    }
}
