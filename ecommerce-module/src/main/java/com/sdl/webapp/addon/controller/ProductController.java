package com.sdl.webapp.addon.controller;

import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.model.Entity;
import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.api.model.entity.EclItem;
import com.sdl.webapp.common.controller.AbstractController;
import com.sdl.webapp.ecommerce.ECommerceException;
import com.sdl.webapp.ecommerce.ProductCatalog;
import com.sdl.webapp.ecommerce.cart.ShoppingCartHelper;
import com.sdl.webapp.ecommerce.model.Product;
import com.sdl.webapp.ecommerce.model.entity.ProductContent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

/**
 * Product Content com.sdl.webapp.addon.controller for the E-Commerce area.
 *
 * This handles include requests to /system/mvc/ECommerce/Product/{regionName}/{entityId}
 */
@Controller
@RequestMapping("/system/mvc/ECommerce/Product")
public class ProductController extends AbstractController {
    private static final Logger LOG = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductCatalog productCatalog;  // TODO: Wire to a specific product catalog here??? So we can support several product cataloges at the same time

    /**
     * Handles a request for an entity.
     *
     * @param request The request.
     * @param regionName The region name.
     * @param entityId The entity id.
     * @return The name of the entity view that should be rendered for this request.
     * @throws com.sdl.webapp.common.api.content.ContentProviderException If an error occurs so that the entity cannot not be retrieved.
     */
    @RequestMapping(method = RequestMethod.GET, value = "Product/{regionName}/{entityId}")
    public String handleGetEntity(HttpServletRequest request, @PathVariable String regionName,
                                  @PathVariable String entityId)
            throws ContentProviderException {
        LOG.trace("handleGetEntity: regionName={}, entityId={}", regionName, entityId);

        try {
            Entity productEntity = getEntityFromRequest(request, regionName, entityId);
            String productId = request.getParameter("productId");
            Product product;
            if ( productId != null ) {
                product = this.productCatalog.getProduct(productId);
            }
            else if (productEntity instanceof EclItem ) {
                EclItem productRef = (EclItem) productEntity;
                product = this.productCatalog.getProduct(productRef.getItemId());

            }
            else if (productEntity instanceof ProductContent) {
                ProductContent productContent = (ProductContent) productEntity;
                product = this.productCatalog.getProduct(productContent.getProductRef().getItemId());
                request.setAttribute("product", product);
            }
            else {
                throw new ContentProviderException("Invalid product entity: " + productEntity.getId());
            }

            request.setAttribute("product", product);
            request.setAttribute("entity", productEntity);
            final MvcData mvcData = productEntity.getMvcData();
            LOG.trace("Entity MvcData: {}", mvcData);
            return mvcData.getAreaName() + "/Entity/" + mvcData.getViewName();
        }
        catch (ECommerceException e) {
            throw new ContentProviderException("Could not get product from ECommerce.", e);
        }
    }
}