package com.sdl.webapp.ecommerce.link;

import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.content.ContentProvider;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.content.PageNotFoundException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.ecommerce.ECommerceException;
import com.sdl.webapp.ecommerce.LinkResolver;
import com.sdl.webapp.ecommerce.model.Product;
import com.sdl.webapp.ecommerce.model.entity.ProductContent;
import com.sdl.webapp.tridion.TridionLinkResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.MessageFormat;

/**
 * LinkResolverImpl
 *
 * @author nic
 */
@Component
public class LinkResolverImpl implements LinkResolver {

    @Autowired
    private TridionLinkResolver tridionLinkResolver;

    @Autowired
    private ContentProvider contentProvider;

    @Autowired
    private WebRequestContext webRequestContext;

    @Override
    public String resolveProductPage(Product product) throws ECommerceException {

        try {
            String configNamespace = product.getModuleName().toLowerCase();
            Localization localization = this.webRequestContext.getLocalization();
            String pageUrlPattern =localization.getConfiguration(configNamespace + ".pageUrlPattern");
            String pageUrl = MessageFormat.format(pageUrlPattern, product.getId());

            try {
                // TODO: This is too slow operation
                this.contentProvider.getPageContent(pageUrl, localization);
            }
            catch ( PageNotFoundException e ) {
                pageUrl = localization.getConfiguration(configNamespace + ".genericDetailPage");
                pageUrl += "?productId=" + product.getId();
            }
            return pageUrl;
       } catch (Exception e) {
            throw new ECommerceException("Could not resolve product page for product with ID: " + product.getId(), e);
       }
    }

    @Override
    public String resolveProductContentPage(ProductContent productContent) throws ECommerceException {

        // TODO: TO BE IMPLEMENTED

        return null;
    }
}
