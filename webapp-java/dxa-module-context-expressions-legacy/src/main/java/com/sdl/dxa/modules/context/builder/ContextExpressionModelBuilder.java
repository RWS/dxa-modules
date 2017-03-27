package com.sdl.dxa.modules.context.builder;

import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.tridion.mapping.EntityBuilder;
import lombok.extern.slf4j.Slf4j;
import org.dd4t.contentmodel.Component;
import org.dd4t.contentmodel.ComponentPresentation;
import org.dd4t.contentmodel.Field;

import java.util.Map;

import static com.sdl.webapp.util.dd4t.FieldUtils.getStringValues;

@org.springframework.stereotype.Component
@Slf4j
public class ContextExpressionModelBuilder extends AbstractContextExpressionModelBuilder implements EntityBuilder {

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
}
