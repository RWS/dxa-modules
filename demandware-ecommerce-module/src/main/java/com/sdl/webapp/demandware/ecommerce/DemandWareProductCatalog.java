package com.sdl.webapp.demandware.ecommerce;

import com.demandware.api.ShopClient;
import com.demandware.api.model.ProductSearchHit;
import com.demandware.api.model.ProductSearchResult;
import com.sdl.webapp.demandware.ecommerce.model.DemandWareCategory;
import com.sdl.webapp.demandware.ecommerce.model.DemandWareProduct;
import com.sdl.webapp.ecommerce.AbstractProductCatalog;
import com.sdl.webapp.ecommerce.ECommerceException;
import com.sdl.webapp.ecommerce.interceptor.SimpleCacheInterceptor;
import com.sdl.webapp.ecommerce.model.Category;
import com.sdl.webapp.ecommerce.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

/**
 * DemandWareProductCatalog
 *
 * @author nic
 */
@Repository("productCatalog") // TODO: Rename this dwreProductCatalog, to allow other product catalogs to be active at the same time ???
public class DemandWareProductCatalog extends AbstractProductCatalog {

    @Autowired
    private ShopClientFactory shopClientFactory;

    private ShopClient shopClient;

    @Value("${ecommerce.demandware.cacheTime}")
    private long cacheTime;

    static final int CATEGORY_MAX_NO_OF_PRODUCTS = 100;

    public DemandWareProductCatalog() {
        super(null);
    }

    @PostConstruct
    public void initialize() {
        this.shopClient = this.shopClientFactory.newShopSession();
        SimpleCacheInterceptor cacheInterceptor = new SimpleCacheInterceptor(cacheTime);
        this.addEntityPreprocessInterceptor(cacheInterceptor);
        this.addEntityPostprocessInterceptor(cacheInterceptor);
    }

    @Override
    protected Category doGetCategory(String id) throws ECommerceException {
        com.demandware.api.model.Category dwreCategory = this.shopClient.getCategory(id);
        if ( dwreCategory != null ) {
            return new DemandWareCategory(dwreCategory);
        }
        return null;
    }

    @Override
    protected Product doGetProduct(String id) throws ECommerceException {
        com.demandware.api.model.Product dwreProduct = this.shopClient.getProduct(id);
        if ( dwreProduct != null ) {
            return new DemandWareProduct(dwreProduct);
        }
        return null;
    }

    public List<Product> getProducts(Category category) throws ECommerceException {

        ProductSearchResult searchResult = this.shopClient.searchProductsByCategory(category.getId(), CATEGORY_MAX_NO_OF_PRODUCTS);
        List<Product> products = new ArrayList<>();
        for ( ProductSearchHit searchHit : searchResult.getHits() ) {
            // TODO: Use product search hit here instead to create the actual product
            // And if more data is needed, THEN the full DWRE product is read...
            products.add(this.getProduct(searchHit.getProduct_id()));
        }
        return products;
    }

}
