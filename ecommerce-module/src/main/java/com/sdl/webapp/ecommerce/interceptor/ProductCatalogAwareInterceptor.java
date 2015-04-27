package com.sdl.webapp.ecommerce.interceptor;

import com.sdl.webapp.ecommerce.ProductCatalog;
import com.sdl.webapp.ecommerce.ProductCatalogAware;
import com.sdl.webapp.ecommerce.model.ECommerceEntity;

/**
 * ProductCatalogAwareInterceptor
 *
 * @author nic
 */
public class ProductCatalogAwareInterceptor implements ECommerceEntityInterceptor {

    private ProductCatalog productCatalog;

    public ProductCatalogAwareInterceptor(ProductCatalog productCatalog) {
        this.productCatalog = productCatalog;
    }

    @Override
    public ECommerceEntity preprocess(String id, ECommerceEntity entity, Class<? extends ECommerceEntity> entityClass) {
        return entity;
    }

    @Override
    public ECommerceEntity postprocess(String id, ECommerceEntity entity, Class<? extends ECommerceEntity> entityClass) {

        if ( entity instanceof ProductCatalogAware ) {
            ((ProductCatalogAware) entity).setProductCatalog(this.productCatalog);
        }
        return entity;
    }

}
