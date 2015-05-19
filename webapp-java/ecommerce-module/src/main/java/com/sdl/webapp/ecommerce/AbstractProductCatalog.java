package com.sdl.webapp.ecommerce;

import com.sdl.webapp.common.api.content.ContentProvider;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.mapping.config.SemanticSchema;
import com.sdl.webapp.common.util.TcmUtils;
import com.sdl.webapp.ecommerce.interceptor.ECommerceEntityInterceptor;
import com.sdl.webapp.ecommerce.interceptor.LinkResolverAwareInterceptor;
import com.sdl.webapp.ecommerce.interceptor.ProductCatalogAwareInterceptor;
import com.sdl.webapp.ecommerce.link.LinkResolverImpl;
import com.sdl.webapp.ecommerce.model.Category;
import com.sdl.webapp.ecommerce.model.ECommerceEntity;
import com.sdl.webapp.ecommerce.model.Product;
import com.sdl.webapp.ecommerce.model.entity.ProductContent;
import com.sdl.webapp.tridion.TridionLinkResolver;
import com.sdl.webapp.tridion.query.BrokerQueryException;
import com.sdl.webapp.tridion.query.GenericBrokerQuery;
import com.sdl.webapp.tridion.xpm.ComponentType;
import com.sdl.webapp.tridion.xpm.XpmRegion;
import com.sdl.webapp.tridion.xpm.XpmRegionConfig;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * AbstractProductCatalog
 *
 * @author nic
 */
public abstract class AbstractProductCatalog implements ProductCatalog {

    @Autowired
    private ContentProvider contentProvider;

    @Autowired
    private XpmRegionConfig xpmRegionConfig;

    @Autowired
    private LinkResolver linkResolver;

    private String productContentSchemaName;

    private List<ECommerceEntityInterceptor> entityPreprocessInterceptors = new ArrayList<>();
    private List<ECommerceEntityInterceptor> entityPostprocessInterceptors = new ArrayList<>();

    protected AbstractProductCatalog(String productContentSchemaName) {
        this.productContentSchemaName = productContentSchemaName;
        this.addEntityPostprocessInterceptor(new ProductCatalogAwareInterceptor(this));
    }

    @PostConstruct
    public final void initializeGeneric() {
        LinkResolverAwareInterceptor linkResolverAwareInterceptor = new LinkResolverAwareInterceptor(this.linkResolver);
        this.addEntityPostprocessInterceptor(linkResolverAwareInterceptor);
    }

    protected void addEntityPreprocessInterceptor(ECommerceEntityInterceptor interceptor) {
        this.entityPreprocessInterceptors.add(interceptor);
    }

    protected void addEntityPostprocessInterceptor(ECommerceEntityInterceptor interceptor) {
       this.entityPostprocessInterceptors.add(interceptor);
    }

    @Override
    public Category getCategory(String id) throws ECommerceException {
        Category category = preprocess(id, Category.class);
        if ( category == null ) {
            category = doGetCategory(id);
            if ( category != null ) {
                category = postprocess(category, Category.class);
            }
        }
        return category;
    }

    @Override
    public Product getProduct(String id) throws ECommerceException {
        Product product = preprocess(id, Product.class);
        if ( product == null ) {
            product = doGetProduct(id);
            if ( product != null ) {
                product = postprocess(product, Product.class);
            }
        }
        return product;
    }

    protected abstract Category doGetCategory(String id) throws ECommerceException;
    protected abstract Product doGetProduct(String id) throws ECommerceException;

    private <T extends ECommerceEntity> T preprocess(String id, Class<T> entityClass) {

        T processedEntity = null;
        for ( ECommerceEntityInterceptor interceptor : this.entityPreprocessInterceptors ) {
            processedEntity = (T) interceptor.preprocess(id, processedEntity, entityClass);
        }
        return processedEntity;
    }

    private <T extends ECommerceEntity> T postprocess(T entity, Class<T> entityClass) {

        T processedEntity = entity;
        for ( ECommerceEntityInterceptor interceptor : this.entityPostprocessInterceptors ) {
            processedEntity = (T) interceptor.postprocess(entity.getId(), entity, entityClass);
        }
        return processedEntity;
    }


    // Be able to intercept this as well????
    @Override
    public List<ProductContent> getProductContent(Category category, Localization localization) throws ECommerceException {

        List<ProductContent> allProductContent = this.getAllProductContentFromBroker(localization);
        List<ProductContent> categoryProducts = new ArrayList<>();
        for ( ProductContent productContent : allProductContent ) {
            if ( containsProduct(category, productContent.getProductRef().getItemId()) ) {
                categoryProducts.add(productContent);
            }
        }
        return categoryProducts;
    }

    protected boolean containsProduct(Category category, String productId) throws ECommerceException {
        for ( Product product : category.getProducts() ) {
            if ( product.getId().equals(productId) ) return true;
        }
        return false;
    }

    protected List<ProductContent> getAllProductContentFromBroker(Localization localization) throws ECommerceException {

        // TODO: Can we do a broker query to find the product content matching specific ECL id...????

        if ( this.productContentSchemaName == null ) {
            return Collections.EMPTY_LIST;
        }

        // Do a broker query to fetch product content based on product ECL id
        //
        Map<Long, SemanticSchema> schemas = localization.getSemanticSchemas();

        // Use schema Id to get all product TCM URIs
        //
        SemanticSchema productSchema = null;
        for ( SemanticSchema schema : schemas.values() ) {
            if ( schema.getRootElement().equals(this.productContentSchemaName) ) {
                productSchema = schema;
                break;
            }
        }
        if ( productSchema == null ) throw new ECommerceException("Missing semantic schema for products");

        // Get Template TCM-URI by using XPM Region data.
        // The actual product content template must not be tied to a specific region
        //
        String templateId = null;
        XpmRegion region = this.xpmRegionConfig.getXpmRegion("Main", localization);
        for ( ComponentType componentType : region.getComponentTypes() ) {
            if ( TcmUtils.getItemId(componentType.getSchemaId()) == productSchema.getId() ) {
                templateId = componentType.getTemplateId();
                break;
            }
        }
        if ( templateId == null ) throw new ECommerceException("Missing template for products");

        GenericBrokerQuery query = new GenericBrokerQuery();
        query.setPublicationId(Integer.parseInt(localization.getId()));
        query.setSchemaId((int) productSchema.getId());

        try {
            List<String> entityIdentities = query.executeQuery();
            List<ProductContent> productContentList = new ArrayList<>();
            for ( String entityId : entityIdentities ) {
                ProductContent productContent = (ProductContent) this.contentProvider.getEntityModel(entityId, templateId, localization);
                if ( productContent != null ) {
                    productContentList.add(productContent);
                }
            }

            return productContentList;
        }
        catch ( BrokerQueryException | ContentProviderException e ) {
            throw new ECommerceException("Can not fetch product content.", e);
        }

    }
}
