package com.sdl.dxa.modules.context.content;

import com.sdl.dxa.modules.context.model.Conditions;
import com.sdl.webapp.common.api.content.ConditionalEntityEvaluator;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.contextengine.ContextClaims;
import com.sdl.webapp.common.api.contextengine.ContextClaimsProvider;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.exceptions.DxaException;
import lombok.NonNull;
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
    public boolean includeEntity(@NonNull EntityModel entity) throws ContentProviderException {
        if (log.isDebugEnabled() && (entity.getExtensionData() == null || !entity.getExtensionData().containsKey(contextExpressionsKey))) {
            log.debug("Entity {} is included because there is no extension data with a key {}", entity, contextExpressionsKey);
            return true;
        }

        Map<String, Object> extensionData = entity.getExtensionData();
        if (extensionData == null) {
            log.warn("Extension Data is empty for Entity Model with id='{}'", entity.getId());
            return true;
        }
        Conditions conditions = (Conditions) extensionData.get(contextExpressionsKey);

        if (conditions == null || conditions.isEmpty()) {
            log.warn("Found no conditionsin entity, that looks like an error with entity " + entity);
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

            if (log.isDebugEnabled() && (isExcludedNoIncludes || isExcludedAnyExclude)) {
                log.debug("suppressing entity because of {} Context Expression conditions; entity {}",
                        isExcludedNoIncludes ? "Include" : "Exclude", entity);
                return false;
            }
        } catch (DxaException e) {
            log.warn("Exception while requesting context claims, including entity", e);
            return true;
        }

        if (log.isDebugEnabled()) {
            log.debug("All include/exclude context conditions are satisfied, including entity " + entity);
        }
        return true;
    }

    private boolean shouldBeExcluded(@Nullable Set<String> cxs, @NonNull Map<String, Object> contextClaims, @NonNull Mode mode) {
        //if set is null, then we don't process, and return FALSE for "excluded"
        if (cxs == null || cxs.isEmpty()) {
            log.debug("Context expression set is empty or null, ignoring");
            return false;
        }

        //ignore any unknown claims
        Set<String> filtered = filterCxsByClaims(cxs, contextClaims);
        if (filtered.isEmpty()) {
            log.debug("Filtered context expressions set is empty, meaning expressions are not in context claims");
            //if set is empty, then we don't process, and return FALSE for "excluded"
            return false;
        }

        //if this is INCLUDE, then any include means FALSE for "excluded"
        //if this is EXCLUDE, then any exclude means TRUE for "excluded"
        return (mode == Mode.INCLUDE) != anyCxIsTrue(filtered, contextClaims);
    }

    @NotNull
    private Set<String> filterCxsByClaims(@NonNull Set<String> contextExpressions, @NonNull Map<String, Object> contextClaims) {
        Set<String> filtered = new HashSet<>();
        for (String claimName : contextExpressions) {
            if (contextClaims.containsKey(claimName)) {
                filtered.add(claimName);
            }
        }
        return filtered;
    }

    private boolean anyCxIsTrue(@NonNull Set<String> contextExpressions, @NonNull Map<String, Object> contextClaims) {
        //also covers if set is empty, then we don't iterate
        for (String claimName : contextExpressions) {
            Boolean claimValue = ContextClaims.castClaim(contextClaims.get(claimName), Boolean.class);
            if (claimValue != null && claimValue) {
                return true;
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
