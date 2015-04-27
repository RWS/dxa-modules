package com.sdl.webapp.demandware.ecommerce.model;

import com.sdl.webapp.demandware.ecommerce.DemandWareProductCatalog;
import com.sdl.webapp.ecommerce.ECommerceException;
import com.sdl.webapp.ecommerce.ProductCatalog;
import com.sdl.webapp.ecommerce.ProductCatalogAware;
import com.sdl.webapp.ecommerce.model.AbstractEcommerceModel;
import com.sdl.webapp.ecommerce.model.Category;
import com.sdl.webapp.ecommerce.model.Product;

import java.util.ArrayList;
import java.util.List;

/**
 * DemandWare Category
 *
 * @author nic
 */
public class DemandWareCategory extends AbstractEcommerceModel implements Category, ProductCatalogAware {

    private com.demandware.api.model.Category dwreCategory;
    private List<Category> categories = null;
    private List<Product> products = null;
    private DemandWareProductCatalog productCatalog;

    public DemandWareCategory(com.demandware.api.model.Category dwreCategory) {
        this.dwreCategory = dwreCategory;
    }

    @Override
    public String getModuleName() {
        return Constants.MODULE_NAME;
    }

    @Override
    public void setProductCatalog(ProductCatalog productCatalog) {
        this.productCatalog = (DemandWareProductCatalog) productCatalog;
    }

    @Override
    public List<Category> getCategories() throws ECommerceException {
        if ( this.categories == null ) {
            this.categories = new ArrayList<>();
            for (com.demandware.api.model.Category category : this.dwreCategory.getCategories() ) {
                this.categories.add(new DemandWareCategory(category));
            }
        }
        return this.categories;
    }

    @Override
    public List<Product> getProducts() throws ECommerceException {

        if ( this.products == null ) {
            this.products = this.productCatalog.getProducts(this);
        }
        return this.products;
    }

    @Override
    public String getId() {
        return this.dwreCategory.getId();
    }

    @Override
    public String getName() {
        return this.dwreCategory.getName();
    }

}
