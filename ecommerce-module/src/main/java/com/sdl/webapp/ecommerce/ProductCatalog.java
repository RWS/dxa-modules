package com.sdl.webapp.ecommerce;

import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.ecommerce.model.Category;
import com.sdl.webapp.ecommerce.model.Product;
import com.sdl.webapp.ecommerce.model.entity.ProductContent;

import java.util.List;

/**
 * Product Catalog
 *
 * @author nic
 */
public interface ProductCatalog {

    // TODO: Decouple this further and have abstract Product & Category Reference interfaces?? I.e. instead of having string references???
    // ProductRef -> which can be a string or something else...
    // Which can created through an ECL reference maybe????


    Category getCategory(String id) throws ECommerceException;

    Product getProduct(String id) throws ECommerceException;

    List<ProductContent> getProductContent(Category category, Localization localization) throws ECommerceException;

}
