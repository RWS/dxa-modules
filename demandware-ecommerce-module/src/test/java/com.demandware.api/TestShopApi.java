/*
 * Copyright 2014 Niclas Cedermalm
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.demandware.api;

import com.demandware.api.model.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

/**
 * TestShop Api
 *
 * @author nic
 */
public class TestShopApi {

    static private Log log = LogFactory.getLog(TestShopApi.class);

    private ShopClient shopClient;

    @Before
    public void initialize() {
        this.shopClient = new ShopClient("https://fredhopper01-tech-prtnr-eu01-dw.demandware.net/s/SiteGenesis", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    }

    @Test
    public void testGetCart()  throws Exception {
        log.info("Getting current cart...");
        Basket basket = this.shopClient.getBasket();
        this.printBasket(basket);
    }

    @Test
    public void testAddToCart() throws Exception {
        log.info("Adding product to cart...");

        ProductItem product = new ProductItem();
        product.setProduct_id("sanyo-dp50747");
        product.setQuantity(1.0f);
        Basket basket = this.shopClient.addProductToBasket(product);
        this.printBasket(basket);

        //log.info("Cookies: " + this.shopClient.getCookies());

        log.info("Getting current cart...");
        basket = this.shopClient.getBasket();
        this.printBasket(basket);

    }

    @Test
    public void testGetProduct() throws Exception {
        log.info("Test getting product...");

        Product product = this.shopClient.getProduct("sanyo-dp50747");
        log.info("Product ID: " + product.getId() + " name: " + product.getName());
        log.info("Short description: " + product.getShort_description());
        for ( ImageGroup imageGroup : product.getImage_groups() ) {
            log.info("Image Group view type: " + imageGroup.getView_type());
            for ( Image image : imageGroup.getImages() ) {
                log.info("Image link: " + image.getLink());
            }
        }

    }

    @Test
    public void testGetProductsByCategory() throws Exception {

        log.info("Getting category info...");
        Category category = this.shopClient.getCategory("electronics-televisions");//"electronics-televisions"); // "electronics-digital-cameras"
        log.info("Category name: " + category.getName());
        log.info("Getting products by category...");

        ProductSearchResult searchResult = this.shopClient.searchProductsByCategory(category.getId(), 16);
        log.info("Number of products: " + searchResult.getTotal());

        log.info("Available Refinements:");
        for ( ProductSearchRefinement refinement : searchResult.getRefinements() ) {
            log.info("Refinement ID:" + refinement.getAttribute_id() + ", label: " + refinement.getLabel());
        }

        while ( searchResult != null ) {
            for (ProductSearchHit hit : searchResult.getHits()) {
                log.info("  Product ID: " + hit.getProduct_id());
            }
            log.info("Getting next products...");
            searchResult = this.shopClient.getNext(searchResult);
        }

    }

    @Test
    public void testGetProductsByRefinements() throws Exception {

        log.info("Getting getting products by refinements...");
        Category category = this.shopClient.getCategory("electronics-televisions");
        log.info("Category name: " + category.getName());
        log.info("Getting products by category...");

        Map<String,String> refinements = new HashMap<>();
        refinements.put("brand", "Sony");
        ProductSearchResult searchResult = this.shopClient.searchProductsByCategory(category.getId(), 16, refinements);

        log.info("Number of products: " + searchResult.getTotal());

        for (ProductSearchHit hit : searchResult.getHits()) {
            log.info("  Product ID: " + hit.getProduct_id());
        }

        log.info("Selected refinements: " + searchResult.getSelected_refinements());
        Map<String,String> refinements2 = searchResult.getSelected_refinements();
        //refinements2.put("brand", "Samsung|Sony");
        refinements2.put("price", "(500..1000)");
        log.info("Updated refinements: " + refinements2);

        searchResult = this.shopClient.searchProductsByCategory(category.getId(), 16, refinements2);

        log.info("Number of products: " + searchResult.getTotal());

        for (ProductSearchHit hit : searchResult.getHits()) {
            log.info("  Product ID: " + hit.getProduct_id());
        }
        log.info("Selected refinements: " + searchResult.getSelected_refinements());

    }

    private void printBasket(Basket basket) {
        log.info("Basket currency:" + basket.getCurrency() + " product total: " + basket.getProduct_total() + " subtotal: " + basket.getProduct_sub_total());
        log.info("ETag: " + basket.getEtag());
        if ( basket.getProduct_items() != null ) {
            log.info("Products: ");
            for (ProductItem productItem :basket.getProduct_items()) {
                log.info("Product ID: " + productItem.getProduct_id() + ",Name: " + productItem.getProduct_name() + ", Text: " + productItem.getItem_text());
            }
            log.info("Total price: " + basket.getProduct_total());
        }
    }
}
