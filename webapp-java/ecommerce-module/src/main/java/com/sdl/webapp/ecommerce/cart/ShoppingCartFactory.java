package com.sdl.webapp.ecommerce.cart;

import com.sdl.webapp.ecommerce.ECommerceException;

/**
 * ShoppingBasketFactory
 *
 * @author nic
 */
public interface ShoppingCartFactory {

    ShoppingCart create() throws ECommerceException;
}
