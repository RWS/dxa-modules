package com.sdl.webapp.demandware.ecommerce;

import com.sdl.webapp.ecommerce.ECommerceException;
import com.sdl.webapp.ecommerce.ProductCatalog;
import com.sdl.webapp.ecommerce.cart.ShoppingCart;
import com.sdl.webapp.ecommerce.cart.ShoppingCartFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * DemandWareShoppingBasketFactory
 *
 * @author nic
 */
@Component
public class DemandWareShoppingCartFactory implements ShoppingCartFactory {

    @Autowired
    private ShopClientFactory shopClientFactory;

    @Autowired
    private ProductCatalog productCatalog;


    @Override
    public ShoppingCart create() throws ECommerceException {
        return new DemandWareShoppingCart(this.shopClientFactory.newShopSession(), this.productCatalog);
    }
}
