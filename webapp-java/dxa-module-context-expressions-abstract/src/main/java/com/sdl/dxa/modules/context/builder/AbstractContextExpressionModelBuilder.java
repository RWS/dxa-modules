package com.sdl.dxa.modules.context.builder;

import com.sdl.dxa.modules.context.model.Conditions;
import com.sdl.webapp.common.api.model.EntityModel;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;

import java.util.Collection;

import static com.google.common.collect.Sets.newHashSet;

@Slf4j
public abstract class AbstractContextExpressionModelBuilder implements Ordered {

    @Value("${dxa.modules.contextexpr.extension_data_map_key}")
    String contextExpressionsKey = "ContextExpressions";

    @NotNull
    <T extends EntityModel> T applyConditions(T originalEntityModel, Collection<String> includeCx, Collection<String> excludeCx) {
        Conditions conditions = new Conditions(newHashSet(includeCx), newHashSet(excludeCx));

        log.debug("Found these context expressions {}", conditions);

        originalEntityModel.addExtensionData(contextExpressionsKey, conditions);

        return originalEntityModel;
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
