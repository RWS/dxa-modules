package com.sdl.dxa.modules.context.content;

import com.sdl.dxa.modules.context.model.Conditions;
import com.sdl.webapp.common.api.content.ConditionalEntityEvaluator;
import com.sdl.webapp.common.api.contextengine.ContextClaimsProvider;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.exceptions.DxaException;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Implementation of {@link ConditionalEntityEvaluator} that analyzes Context Expression Conditions
 * set as {@link ViewModel#getExtensionData()}.
 */
@Component
@Slf4j
public class ContextExpressionEntityEvaluator implements ConditionalEntityEvaluator {

    @Autowired
    private ContextClaimsProvider contextClaimsProvider;

    @Value("${dxa.modules.contextexpr.extension_data_map_key}")
    private String contextExpressionsKey = "ContextExpressions";

    /**
     * {@inheritDoc}
     * <p>Determines whether a given Entity Model should be included
     * based on the conditions specified on the Entity Model and the context.</p>
     */
    @Override
    public boolean includeEntity(@NotNull EntityModel entity) {
        if (entity.getExtensionData() == null || !entity.getExtensionData().containsKey(contextExpressionsKey)) {
            log.debug("Entity {} is included because there is no extension data with a key {}", entity, contextExpressionsKey);
            return true;
        }

        Conditions conditions = (Conditions) entity.getExtensionData().get(contextExpressionsKey);
        if (conditions == null || conditions.isEmpty()) {
            log.warn("Found conditions, but they are null or empty, that looks like an error!");
            return true;
        }

        try {
            Map<String, Object> contextClaims = contextClaimsProvider.getContextClaims(null);

            boolean isExcludedNoIncludes = false, isExcludedAnyExclude = false;
            if (shouldBeExcluded(conditions.getIncludes(), contextClaims, Mode.INCLUDE)) {
                isExcludedNoIncludes = true;
            }

            if (!isExcludedNoIncludes && shouldBeExcluded(conditions.getExcludes(), contextClaims, Mode.EXCLUDE)) {
                isExcludedAnyExclude = true;
            }

            if (isExcludedNoIncludes || isExcludedAnyExclude) {
                log.debug("suppressing entity because of {} Context Expression conditions; entity {}",
                        isExcludedNoIncludes ? "Include" : "Exclude", entity);
                return false;
            }
        } catch (DxaException e) {
            log.warn("Exception while requesting context claims, including entity", e);
            return true;
        }

        log.debug("All include/exclude context conditions are satisfied, including Entity");
        return true;
    }

    private boolean shouldBeExcluded(@Nullable Set<String> cxs, @NotNull Map<String, Object> contextClaims, @NotNull Mode mode) {
        //if set is null, then we don't process, and return FALSE for "excluded"
        if (cxs == null) {
            return false;
        }

        //ignore any unknown claims
        Set<String> filtered = filterCxsByClaims(cxs, contextClaims);
        if (filtered.isEmpty()) {
            //if set is empty, then we don't process, and return FALSE for "excluded"
            return false;
        }

        //if this is INCLUDE, then any include means FALSE for "excluded"
        //if this is EXCLUDE, then any exclude means TRUE for "excluded"
        return (mode == Mode.INCLUDE) != anyCxIsTrue(filtered, contextClaims);
    }

    @NotNull
    private Set<String> filterCxsByClaims(@NotNull Set<String> cxs, @NotNull Map<String, Object> contextClaims) {
        Set<String> filtered = new HashSet<>();
        for (String cx : cxs) {
            if (contextClaims.containsKey(cx)) {
                filtered.add(cx);
            }
        }
        return filtered;
    }

    private boolean anyCxIsTrue(@NotNull Set<String> cxs, @NotNull Map<String, Object> contextClaims) {
        //also covers if set is empty, then we don't iterate
        for (String cx : cxs) {
            Object o = contextClaims.get(cx);
            if (o instanceof Boolean) {
                if (((Boolean) o)) {
                    return true;
                }
            }
        }
        //set is empty or all conditions are not satisfied
        return false;
    }

    private enum Mode {
        /**
         * This is include condition.
         */
        INCLUDE,
        /**
         * This is exclude condition.
         */
        EXCLUDE
    }
}
