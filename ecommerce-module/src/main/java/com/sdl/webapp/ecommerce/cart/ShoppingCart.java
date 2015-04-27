package com.sdl.webapp.ecommerce.cart;

import com.sdl.webapp.ecommerce.ECommerceException;
import com.sdl.webapp.ecommerce.model.Product;

import java.net.URI;
import java.util.List;
import java.util.Map;

/**
 * ShoppingBasket
 *
 * @author nic
 */
public interface ShoppingCart {

    static public final URI CART_URI = URI.create("taf:claim:ecommerce.cart");
    static public final URI CART_ITEMS_URI = URI.create("taf:claim:ecommerce:cart:items");
    static public final URI CART_TOTAL_PRICE_URI = URI.create("taf:claim:ecommerce:cart:totalPrice");

    void addProduct(Product product) throws ECommerceException;

    void addProduct(String productId) throws ECommerceException;

    List<CartItem> getItems() throws ECommerceException;

    int count() throws ECommerceException;

    void clear() throws ECommerceException;

    float getTotalPrice() throws ECommerceException;

    Map<URI,Object> getDataToExposeToClaimStore() throws ECommerceException;

}
