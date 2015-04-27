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

package com.demandware.api.model;

import java.util.List;

/**
 * Basket
 *
 * @author nic
 */
public class Basket {

    private String currency;
    private Float product_sub_total;
    private Float product_total;
    private Float shipping_total;
    private Float tax_total;
    private Float order_total;
    private List<ProductItem> product_items;
    private String etag;

    public Float getOrder_total() {
        return order_total;
    }

    public void setOrder_total(Float order_total) {
        this.order_total = order_total;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Float getProduct_sub_total() {
        return product_sub_total;
    }

    public void setProduct_sub_total(Float product_sub_total) {
        this.product_sub_total = product_sub_total;
    }

    public Float getProduct_total() {
        return product_total;
    }

    public void setProduct_total(Float product_total) {
        this.product_total = product_total;
    }

    public Float getShipping_total() {
        return shipping_total;
    }

    public void setShipping_total(Float shipping_total) {
        this.shipping_total = shipping_total;
    }

    public Float getTax_total() {
        return tax_total;
    }

    public void setTax_total(Float tax_total) {
        this.tax_total = tax_total;
    }

    public List<ProductItem> getProduct_items() {
        return product_items;
    }

    public void setProduct_items(List<ProductItem> product_items) {
        this.product_items = product_items;
    }

    public int getNoOfProducts() {
        return this.product_items == null ? 0 : this.product_items.size();
    }

    public String getEtag() {
        return etag;
    }

    public void setEtag(String etag) {
        this.etag = etag;
    }
}
