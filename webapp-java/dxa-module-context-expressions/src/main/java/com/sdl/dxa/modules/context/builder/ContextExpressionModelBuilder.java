package com.sdl.dxa.modules.context.builder;

import com.sdl.dxa.modules.context.model.Conditions;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.tridion.mapping.EntityBuilder;
import lombok.extern.slf4j.Slf4j;
import org.dd4t.contentmodel.Component;
import org.dd4t.contentmodel.ComponentPresentation;
import org.dd4t.contentmodel.Field;
import org.springframework.beans.factory.annotation.Value;

import java.util.Map;

import static com.google.common.collect.Sets.newHashSet;
import static com.sdl.webapp.util.dd4t.FieldUtils.getStringValues;

@org.springframework.stereotype.Component
@Slf4j
public class ContextExpressionModelBuilder implements EntityBuilder {

    @Value("${dxa.modules.contextexpr.extension_data_map_key}")
    private String contextExpressionsKey = "ContextExpressions";

    @Override
    public EntityModel createEntity(ComponentPresentation componentPresentation, EntityModel originalEntityModel, Localization localization) throws ContentProviderException {
        log.trace("Context expression model builder for CP {}, entity {} and localization {}", componentPresentation, originalEntityModel, localization);

        if (componentPresentation.getExtensionData() == null
                || !componentPresentation.getExtensionData().containsKey(contextExpressionsKey)) {
            log.debug("ContextExpressions not found in {}", componentPresentation);
            return originalEntityModel;
        }

        Map<String, Field> content = componentPresentation.getExtensionData().get(contextExpressionsKey).getContent();
        Conditions conditions = new Conditions(
                newHashSet(getStringValues(content.get("Include"))),
                newHashSet(getStringValues(content.get("Exclude"))));

        log.debug("Found these context expressions {}", conditions);

        originalEntityModel.addExtensionData(contextExpressionsKey, conditions);

        return originalEntityModel;
    }

    @Override
    public EntityModel createEntity(Component component, EntityModel originalEntityModel, Localization localization) throws ContentProviderException {
        return originalEntityModel;
    }

    @Override
    public EntityModel createEntity(Component component, EntityModel originalEntityModel, Localization localization, Class<AbstractEntityModel> entityClass) throws ContentProviderException {
        return originalEntityModel;
    }
}
