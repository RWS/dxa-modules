package com.sdl.webapp.ecommerce.model.entity;

import com.sdl.webapp.common.api.mapping.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.entity.AbstractEntity;
import com.sdl.webapp.common.api.model.entity.EclItem;
import com.sdl.webapp.common.api.model.entity.MediaItem;

import static com.sdl.webapp.common.api.mapping.config.SemanticVocabulary.SDL_CORE;

/**
 * Product Content
 *
 * @author nic
 */
public abstract class ProductContent extends AbstractEntity {

    @SemanticProperty("pb:productRef")
    protected EclItem productRef;

    public EclItem getProductRef() {
        return productRef;
    }

    public void setProductRef(EclItem productRef) {
        this.productRef = productRef;
    }

    // TODO: Get a reference to the product as well?

}
