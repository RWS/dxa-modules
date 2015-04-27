package com.sdl.webapp.addon.controller;

import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.content.ContentResolver;
import com.sdl.webapp.common.api.model.Entity;
import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.api.model.entity.GenericWidget;
import com.sdl.webapp.common.controller.AbstractController;
import com.sdl.webapp.ecommerce.ECommerceException;
import com.sdl.webapp.ecommerce.cart.ShoppingCart;
import com.sdl.webapp.ecommerce.cart.ShoppingCartHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * BasketController
 *
 * @author nic
 */
@Controller
@RequestMapping("/system/mvc/ECommerce/Cart")
public class CartController extends AbstractController {

    //@Autowired
    //private ContentResolver contentResolver;

    //@Autowired
    //private WebRequestContext webRequestContext;

    @RequestMapping(method = RequestMethod.GET, value = "Cart/{regionName}/{entityId}")
    public String handleGetEntity(HttpServletRequest request, @PathVariable String regionName,
                                  @PathVariable String entityId) throws ContentProviderException {


        Entity cartWidget = this.getEntityFromRequest(request, regionName, entityId);

        System.out.println("CART WIDGET: " + cartWidget);

        /*
        String showBasketUrl = this.contentResolver.resolveLink("tcm:0-" + cartWidget.getId(),
                                                                this.webRequestContext.getLocalization().getId());
        request.setAttribute("showCartUrl", showBasketUrl);
        */


        ShoppingCart cart = ShoppingCartHelper.instance();

        request.setAttribute("entity", cartWidget);
        request.setAttribute("cart", cart);

        final MvcData mvcData = cartWidget.getMvcData();
        return mvcData.getAreaName() + "/Entity/" + mvcData.getViewName();
    }

}
