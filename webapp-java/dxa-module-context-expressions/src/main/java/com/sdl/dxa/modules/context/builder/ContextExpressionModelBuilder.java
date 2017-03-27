package com.sdl.dxa.modules.context.builder;

import com.sdl.dxa.api.datamodel.model.EntityModelData;
import com.sdl.dxa.api.datamodel.model.util.ListWrapper;
import com.sdl.dxa.tridion.mapping.EntityModelBuilder;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.exceptions.DxaException;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Component
@Slf4j
public class ContextExpressionModelBuilder extends AbstractContextExpressionModelBuilder implements EntityModelBuilder {

    @Value("${dxa.modules.contextexpr.r2.extension_data_map_key}")
    private String cxKeyR2 = "CX";

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
