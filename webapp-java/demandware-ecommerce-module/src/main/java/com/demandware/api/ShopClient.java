package com.demandware.api;

import com.demandware.api.model.*;
import com.sun.jersey.api.client.*;
import com.sun.jersey.api.client.filter.ClientFilter;
import com.sun.jersey.api.json.JSONConfiguration;
import com.sun.jersey.client.apache.ApacheHttpClient;
import com.sun.jersey.client.apache.config.ApacheHttpClientConfig;
import com.sun.jersey.client.apache.config.DefaultApacheHttpClientConfig;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Shop Client
 *
 * @author nic
 */
@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ShopClient {

    static private Log log = LogFactory.getLog(ShopClient.class);

    static final String BASE_URL_PATH = "/dw/shop/v14_8";

    private String shopUrl;
    private String clientId;

    private String shopBaseUrl;
    private Client client;
    private WebResource basketResource;
    private WebResource productResource;
    private WebResource productSearchResource;
    private WebResource categoryResource;


    public ShopClient(String shopUrl, String clientId) {
        this.shopUrl = shopUrl;
        this.clientId = clientId;
        setup();
    }

    public void setup() {
        this.shopBaseUrl = shopUrl + BASE_URL_PATH;

        ApacheHttpClientConfig clientConfig = new DefaultApacheHttpClientConfig();
        clientConfig.getProperties().put(ApacheHttpClientConfig.PROPERTY_HANDLE_COOKIES, true);
        clientConfig.getFeatures().put(JSONConfiguration.FEATURE_POJO_MAPPING, Boolean.TRUE);
        clientConfig.getClasses().add(JsonObjectMapperProvider.class);

        this.client = ApacheHttpClient.create(clientConfig);

        this.basketResource = this.client.resource(this.shopBaseUrl + "/basket/this").queryParam("client_id", this.clientId);
        this.productResource = this.client.resource(this.shopBaseUrl + "/products").queryParam("client_id", this.clientId);
        this.productSearchResource = this.client.resource(this.shopBaseUrl + "/product_search").queryParam("client_id", this.clientId);
        this.categoryResource = this.client.resource(this.shopBaseUrl + "/categories").queryParam("client_id", this.clientId);
    }


    public Basket getBasket() {

        ClientResponse response = this.basketResource.
                accept(MediaType.APPLICATION_JSON).
                get(ClientResponse.class);
        Basket basket = response.getEntity(Basket.class);
        basket.setEtag(response.getHeaders().getFirst("ETag"));
        return basket;
    }

    public Basket addProductToBasket(String productId) {
        ProductItem product = new ProductItem();
        product.setProduct_id(productId);
        product.setQuantity(1.0f);
        return this.addProductToBasket(product);
    }

    public Basket addProductToBasket(ProductItem product) {
        return this.basketResource.path("/add").
                accept(MediaType.APPLICATION_JSON).
                type(MediaType.APPLICATION_JSON).
                post(Basket.class, product);
    }

    public Product getProduct(String productId) {
        return this.productResource.path("/" + productId).
                queryParam("expand", "availability,links,options,images,prices,variations").
                accept(MediaType.APPLICATION_JSON).
                get(Product.class);
    }

    public Category getCategory(String categoryId) {
        return this.categoryResource.path("/" + categoryId).
                queryParam("levels", "0").
                accept(MediaType.APPLICATION_JSON).
                get(Category.class);
    }

    public ProductSearchResult searchProductsByCategory(String categoryId, int count) {
        return this.productSearchResource.
                queryParam("refine_1", "cgid=" +categoryId).
                queryParam("count", Integer.toString(count)).
                accept(MediaType.APPLICATION_JSON).
                get(ProductSearchResult.class);

    }

    public ProductSearchResult searchProductsByCategory(String categoryId, int count, Map<String,String> refinements ) {
        WebResource searchResource = this.productSearchResource.
                queryParam("refine_1", "cgid=" +categoryId);

        int refineId = 2;
        for ( String refinementId : refinements.keySet() ) {
            searchResource = searchResource.queryParam("refine_" + refineId, refinementId + "=" + refinements.get(refinementId));
            refineId++;
        }

        return searchResource.
                queryParam("count", Integer.toString(count)).
                accept(MediaType.APPLICATION_JSON).
                get(ProductSearchResult.class);

    }

    public ProductSearchResult getNext(ProductSearchResult searchResult) {
        if ( searchResult.getNext() != null ) {
            return this.client.resource(searchResult.getNext()).
                    accept(MediaType.APPLICATION_JSON).
                    get(ProductSearchResult.class);
        }
        return null;
    }

    public ProductSearchResult getPrevious(ProductSearchResult searchResult) {
        if (searchResult.getPrevious() != null) {
            return this.client.resource(searchResult.getPrevious()).
                    accept(MediaType.APPLICATION_JSON).
                    get(ProductSearchResult.class);
        }
        return null;
    }
}
