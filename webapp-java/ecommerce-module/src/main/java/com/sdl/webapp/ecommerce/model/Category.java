package com.sdl.webapp.ecommerce.model;

import com.sdl.webapp.ecommerce.ECommerceException;

import java.util.List;

/**
 * Category
 *
 * @author nic
 */
public interface Category extends ECommerceEntity {

    public List<Category> getCategories() throws ECommerceException;

    public List<Product> getProducts() throws ECommerceException;

    // TODO: Have getProductContent here as well. Then this info can be cached along with the category entity

    /*
    public List<String> getCategoryIds();

    public List<String> getProductIds();
    */

}
