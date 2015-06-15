package com.sdl.webapp.addon.controller;

import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.api.model.entity.EclItem;
import com.sdl.webapp.common.controller.AbstractController;
import com.sdl.webapp.ecommerce.ECommerceException;
import com.sdl.webapp.ecommerce.ProductCatalog;
import com.sdl.webapp.ecommerce.model.Category;
import com.sdl.webapp.ecommerce.model.entity.ProductContent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Product Content com.sdl.webapp.addon.controller for the E-Commerce area.
 *
 * This handles include requests to /system/mvc/ECommerce/Category/{regionName}/{entityId}
 */
@Controller
@RequestMapping("/system/mvc/ECommerce/Category")
public class CategoryController extends AbstractController {
    private static final Logger LOG = LoggerFactory.getLogger(CategoryController.class);

    private final WebRequestContext webRequestContext;

    private final ProductCatalog productCatalog;

    @Autowired
    public CategoryController(ProductCatalog productCatalog, WebRequestContext webRequestContext) {
        this.productCatalog = productCatalog;
        this.webRequestContext = webRequestContext;
    }

    /**
     * Handles a request for an entity.
     *
     * @param request The request.
     * @param regionName The region name.
     * @param entityId The entity id.
     * @return The name of the entity view that should be rendered for this request.
     * @throws com.sdl.webapp.common.api.content.ContentProviderException If an error occurs so that the entity cannot not be retrieved.
     */
    @RequestMapping(method = RequestMethod.GET, value = "Category/{regionName}/{entityId}")
    public String handleGetEntity(HttpServletRequest request, @PathVariable String regionName,
                                  @PathVariable String entityId)
            throws ContentProviderException {
        LOG.trace("handleGetEntity: regionName={}, entityId={}", regionName, entityId);

        try {
            EclItem category = (EclItem) getEntityFromRequest(request, regionName, entityId);

            // Fetch products from E-Commerce
            //
            Category ecommerceCategory = this.productCatalog.getCategory(category.getItemId());
            List<ProductContent> productContent = this.productCatalog.getProductContent(ecommerceCategory, this.webRequestContext.getLocalization());

            request.setAttribute("entity", category);
            request.setAttribute("category", ecommerceCategory);

            // TODO: Should products be fetched here as well??? Or is that through the model class???

            request.setAttribute("productContentList", productContent);

            final MvcData mvcData = category.getMvcData();
            LOG.trace("Entity MvcData: {}", mvcData);
            return mvcData.getAreaName() + "/Entity/" + mvcData.getViewName();

        }
        catch (ECommerceException e) {
            throw new ContentProviderException("Could not get category from ECommerce.", e);
        }

    }
}
