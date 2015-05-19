package com.sdl.webapp.addon.controller;

import com.sdl.webapp.common.controller.AbstractController;
import com.sdl.webapp.ecommerce.ECommerceException;
import com.sdl.webapp.ecommerce.cart.ShoppingCart;
import com.sdl.webapp.ecommerce.cart.ShoppingCartHelper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * AjaxCartController
 *
 * @author nic
 */
@Controller
@RequestMapping("/ajax/cart")
public class AjaxCartController extends AbstractController {


    @RequestMapping(method = RequestMethod.GET, value = "addProduct/{productId}")
    public @ResponseBody
    String addProductToCart(HttpServletRequest request, @PathVariable String productId) throws ECommerceException {

        ShoppingCart cart = ShoppingCartHelper.instance();
        cart.addProduct(productId);
        return Integer.toString(cart.count());

    }
}
