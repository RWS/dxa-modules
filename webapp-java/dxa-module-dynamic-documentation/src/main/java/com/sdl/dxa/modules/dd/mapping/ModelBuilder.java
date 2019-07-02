package com.sdl.dxa.modules.dd.mapping;

import com.sdl.dxa.api.datamodel.model.EntityModelData;
import com.sdl.dxa.api.datamodel.model.MvcModelData;
import com.sdl.dxa.api.datamodel.model.PageModelData;
import com.sdl.dxa.modules.dd.DDModuleInitializer;
import com.sdl.dxa.tridion.mapping.EntityModelBuilder;
import com.sdl.dxa.tridion.mapping.PageModelBuilder;
import com.sdl.webapp.common.api.mapping.semantic.SemanticMappingException;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.exceptions.DxaException;
import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Service;

/**
  * Model Builder
  *
  * Remaps 'Ish' mvc area to DynamicDocumentation
 */
@Service
public class ModelBuilder implements EntityModelBuilder, PageModelBuilder {

    private void RemapMvcAreaName(MvcModelData mvcData) {
        if (mvcData != null && mvcData.getAreaName() != null &&
                mvcData.getAreaName().equals("Ish")) {
            mvcData.setAreaName(DDModuleInitializer.DYNAMIC_DOCUMENTATION);
        }
    }

    @Override
    public <T extends EntityModel> T buildEntityModel(@Nullable T t, EntityModelData entityModelData, @Nullable Class<T> aClass) throws DxaException {
        MvcModelData mvcData = entityModelData.getMvcData();
        RemapMvcAreaName(mvcData);
        return t;
    }

    @Override
    public @Nullable PageModel buildPageModel(@Nullable PageModel pageModel, PageModelData pageModelData) throws SemanticMappingException {
        MvcModelData mvcData = pageModelData.getMvcData();
        RemapMvcAreaName(mvcData);
        return pageModel;
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
