package com.sdl.webapp.ecommerce.cart;

import com.sdl.webapp.ecommerce.model.Product;

/**
 * BasketItem
 *
 * @author nic
 */
public class CartItem {

    private Product product;
    private int quantity;
    private float price;

    public CartItem(Product product, int quantity, float price) {
        this.product = product;
        this.quantity = quantity;
        this.price = price;
    }

    public float getPrice() {
        return price;
    }

    public Product getProduct() {
        return product;
    }

    public int getQuantity() {
        return quantity;
    }
}
