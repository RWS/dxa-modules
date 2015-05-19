package com.sdl.webapp.ecommerce;

import com.sdl.webapp.ecommerce.model.Product;
import com.sdl.webapp.ecommerce.model.entity.ProductContent;

/**
 * LinkResolver
 *
 * @author nic
 */
public interface LinkResolver {

    String resolveProductPage(Product product) throws ECommerceException;

    String resolveProductContentPage(ProductContent productContent) throws ECommerceException;
}
