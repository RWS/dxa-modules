package com.sdl.webapp.demandware.ecommerce.model;

import com.sdl.webapp.ecommerce.ECommerceException;
import com.sdl.webapp.ecommerce.LinkResolver;
import com.sdl.webapp.ecommerce.LinkResolverAware;
import com.sdl.webapp.ecommerce.model.AbstractEcommerceModel;
import com.sdl.webapp.ecommerce.model.Product;

/**
 * DemandWare Product
 *
 * @author nic
 */
public class DemandWareProduct extends AbstractEcommerceModel implements Product, LinkResolverAware {

    private com.demandware.api.model.Product dwreProduct;
    private LinkResolver linkResolver;
    private String productPage = null;

    // TODO: Make it also possible to use ProductSearchHit

    public DemandWareProduct(com.demandware.api.model.Product dwreProduct) {
        this.dwreProduct = dwreProduct;
    }

    @Override
    public String getModuleName() {
        return Constants.MODULE_NAME;
    }

    @Override
    public void setLinkResolver(LinkResolver linkResolver) {
        this.linkResolver = linkResolver;
    }

    @Override
    public String getId() {
        return this.dwreProduct.getId();
    }

    @Override
    public String getName() {
        return this.dwreProduct.getName();
    }

    @Override
    public String getProductPage() throws ECommerceException {
        if ( this.productPage == null ) {
            this.productPage = this.linkResolver.resolveProductPage(this);
        }
        return this.productPage;
    }

    public String getBrand() {
        return this.dwreProduct.getBrand();
    }

    public boolean isOrderable() {
        return this.dwreProduct.isOrderable();
    }

    public float getPrice() {
        return this.dwreProduct.getPrice();
    }

    public String getPrimaryCategoryId() {
        return this.dwreProduct.getPrimary_category_id();
    }

    public String getShortDescription() {
        return this.dwreProduct.getShort_description();
    }

    public String getLongDescription() {
        return this.dwreProduct.getLong_description();
    }

    public String getImageUrl() {
        if ( this.dwreProduct.getImage_groups().size() > 0 ) {
            if ( this.dwreProduct.getImage_groups().get(0).getImages().size() > 0 ) {
                return this.dwreProduct.getImage_groups().get(0).getImages().get(0).getLink();
            }
        }
        return null;
    }


}
