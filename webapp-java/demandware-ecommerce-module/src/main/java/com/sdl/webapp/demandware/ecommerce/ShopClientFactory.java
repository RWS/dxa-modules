package com.sdl.webapp.demandware.ecommerce;

import com.demandware.api.ShopClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * ShopClientFactory
 *
 * @author nic
 */
@Component
public class ShopClientFactory {

    @Value("${ecommerce.demandware.shopUrl}")
    private String shopUrl;

    @Value("${ecommerce.demandware.clientId}")
    private String clientId;

    public ShopClient newShopSession() {
        return new ShopClient(shopUrl, clientId);
    }
}
