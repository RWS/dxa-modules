package com.sdl.webapp.ecommerce.adf;

import com.sdl.webapp.adfdelegate.AbstractDelegateeClaimProcessor;
import com.sdl.webapp.ecommerce.ECommerceException;
import com.sdl.webapp.ecommerce.cart.ShoppingCart;
import com.sdl.webapp.ecommerce.cart.ShoppingCartFactory;
import com.tridion.ambientdata.AmbientDataException;
import com.tridion.ambientdata.claimstore.ClaimStore;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.util.Map;

/**
 * Shopping Cart Claim Processor
 * - Expose a set of shopping cart properties to the ADF Claim Store.
 *
 * @author nic
 */
@Component
public class ShoppingCartClaimProcessor extends AbstractDelegateeClaimProcessor {

    static private Log log = LogFactory.getLog(ShoppingCartClaimProcessor.class);

    @Autowired
    private ShoppingCartFactory shoppingCartFactory;


    @Override
    public void onRequestStart(ClaimStore claimStore) throws AmbientDataException {


        ShoppingCart shoppingCart = (ShoppingCart) claimStore.get(ShoppingCart.CART_URI);
        if ( shoppingCart == null ) {
            try {
                shoppingCart = this.shoppingCartFactory.create();
                claimStore.put(ShoppingCart.CART_URI, shoppingCart);
            } catch (ECommerceException e) {
                log.error("Could not create shopping cart.", e);
            }
        }
        else {
            try {
                Map<URI, Object> cartClaimValues = shoppingCart.getDataToExposeToClaimStore();
                for (URI uri : cartClaimValues.keySet()) {
                    claimStore.put(uri, cartClaimValues.get(uri));
                }
            } catch (ECommerceException e) {
                log.error("Could not get data from the E-Commerce Shopping Cart.", e);
            }
        }

    }

}
