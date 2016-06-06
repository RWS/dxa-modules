package com.sdl.dxa.modules.context.builder;

import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.tridion.mapping.EntityBuilder;
import org.dd4t.contentmodel.Component;
import org.dd4t.contentmodel.ComponentPresentation;

@org.springframework.stereotype.Component
public class ContextExpressionModelBuilder implements EntityBuilder {

    @Override
    public EntityModel createEntity(ComponentPresentation componentPresentation, EntityModel originalEntityModel, Localization localization) throws ContentProviderException {
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
