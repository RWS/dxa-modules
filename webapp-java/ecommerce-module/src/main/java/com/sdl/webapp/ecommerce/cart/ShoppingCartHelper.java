package com.sdl.webapp.ecommerce.cart;

import com.tridion.ambientdata.AmbientDataContext;

/**
 * ShoppingBasketHelper
 *
 * @author nic
 */
public final class ShoppingCartHelper {

    private ShoppingCartHelper() {}

    public static ShoppingCart instance() {
        return (ShoppingCart) AmbientDataContext.getCurrentClaimStore().get(ShoppingCart.CART_URI);
    }
}
