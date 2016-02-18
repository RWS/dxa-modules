package com.sdl.dxa.modules.smarttarget.model.entity.smarttarget;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.content.ContentProvider;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.exceptions.DxaException;
import com.sdl.webapp.common.util.ApplicationContextHolder;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

/**
 * <p>SmartTargetItem class.</p>
 */
@EqualsAndHashCode
@ToString
@Slf4j
public class SmartTargetItem {

    private final Localization localization;

    @JsonProperty("Entity")
    private EntityModel entity;

    @Setter(AccessLevel.PRIVATE)
    @Getter
    @JsonProperty("EntityId")
    private String entityId;

    /**
     * <p>Constructor for SmartTargetItem.</p>
     *
     * @param entityId     a {@link java.lang.String} object.
     * @param localization a {@link com.sdl.webapp.common.api.localization.Localization} object.
     */
    public SmartTargetItem(String entityId, Localization localization) {
        this.localization = localization;
        this.entityId = entityId;
    }

    /**
     * <p>Getter for the field <code>entity</code>.</p>
     *
     * @return a {@link com.sdl.webapp.common.api.model.EntityModel} object.
     */
    public EntityModel getEntity() {
        if (this.entity == null) {
            ContentProvider contentProvider = ApplicationContextHolder.getContext().getBean(ContentProvider.class);
            try {
                this.entity = contentProvider.getEntityModel(entityId, localization);
            } catch (ContentProviderException | DxaException e) {
                log.warn("EntityModel not found for entity id {}", entityId, e);
            }
        }
        return entity;
    }
}
