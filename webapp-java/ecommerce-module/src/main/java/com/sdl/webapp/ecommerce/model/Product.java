package com.sdl.webapp.ecommerce.model;


import com.sdl.webapp.ecommerce.ECommerceException;

/**
 * Product
 *
 * @author nic
 */
public interface Product extends ECommerceEntity {

    String getProductPage() throws ECommerceException;

}
