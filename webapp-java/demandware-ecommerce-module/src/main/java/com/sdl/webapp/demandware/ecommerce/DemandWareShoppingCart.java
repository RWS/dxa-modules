package com.sdl.webapp.demandware.ecommerce;

import com.demandware.api.ShopClient;
import com.demandware.api.model.Basket;
import com.demandware.api.model.ProductItem;
import com.sdl.webapp.ecommerce.ECommerceException;
import com.sdl.webapp.ecommerce.ProductCatalog;
import com.sdl.webapp.ecommerce.cart.CartItem;
import com.sdl.webapp.ecommerce.cart.ShoppingCart;
import com.sdl.webapp.ecommerce.model.Product;

import java.net.URI;
import java.util.*;

/**
 * DemandWareShoppingCart
 *
 * @author nic
 */
public class DemandWareShoppingCart implements ShoppingCart {

    private ShopClient shopClient;
    private ProductCatalog productCatalog;
    private List<CartItem> items = new ArrayList<>();
    private float totalPrice = 0f;
    private float shipping = 0f;
    private float tax = 0f;

    public DemandWareShoppingCart(ShopClient shopClient, ProductCatalog productCatalog) throws ECommerceException {
        this.shopClient = shopClient;
        this.productCatalog = productCatalog;
    }

    @Override
    public void addProduct(Product product) throws ECommerceException {
        this.addProduct(product.getId());
    }

    @Override
    public void addProduct(String productId) throws ECommerceException {
        Basket basket = this.shopClient.addProductToBasket(productId);
        this.refresh(basket);
    }

    synchronized private void refresh(Basket basket) throws ECommerceException {

        this.items.clear();
        if ( basket.getProduct_items() != null ) {
            for (ProductItem productItem : basket.getProduct_items()) {
                Product product = this.productCatalog.getProduct(productItem.getProduct_id());
                CartItem item = new CartItem(product, (int) productItem.getQuantity(), productItem.getPrice());
                this.items.add(item);
            }
        }
        this.totalPrice = basket.getProduct_total();
        this.shipping = basket.getShipping_total() != null ? basket.getShipping_total() : 0f;
        this.tax = basket.getTax_total() != null ? basket.getTax_total() : 0f;
    }

    @Override
    public List<CartItem> getItems() throws ECommerceException {
        return this.items;
    }

    @Override
    public int count() throws ECommerceException {
        return this.items.size();
    }

    @Override
    public float getTotalPrice() throws ECommerceException {
        return this.totalPrice;
    }

    public float getShipping() {
        return shipping;
    }

    public float getTax() {
        return tax;
    }

    @Override
    public void clear() throws ECommerceException {
        // TODO: TO BE IMPLEMENTED
    }

    @Override
    public Map<URI,Object> getDataToExposeToClaimStore() throws ECommerceException {

        Map<URI,Object> claims = new HashMap<>();
        claims.put(ShoppingCart.CART_ITEMS_URI, this.count());
        claims.put(ShoppingCart.CART_TOTAL_PRICE_URI, this.getTotalPrice());
        return claims;
    }

    @Override
    public String toString() {
        return "DemandWareShoppingCart {" +
                "items=" + items.size() +
                ", totalPrice=" + totalPrice +
                ", shipping=" + shipping +
                ", tax=" + tax +
                '}';
    }
}
