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
 * Product
 *
 * @author nic
 */
public class Product {

    private String id;
    private String name;
    private String brand;
    private boolean orderable;
    private float price;
    private String primary_category_id;
    private String short_description;
    private String long_description;
    private List<ImageGroup> image_groups;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public boolean isOrderable() {
        return orderable;
    }

    public void setOrderable(boolean orderable) {
        this.orderable = orderable;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public String getPrimary_category_id() {
        return primary_category_id;
    }

    public void setPrimary_category_id(String primary_category_id) {
        this.primary_category_id = primary_category_id;
    }

    public String getShort_description() {
        return short_description;
    }

    public void setShort_description(String short_description) {
        this.short_description = short_description;
    }

    public String getLong_description() {
        return long_description;
    }

    public void setLong_description(String long_description) {
        this.long_description = long_description;
    }

    public List<ImageGroup> getImage_groups() {
        return image_groups;
    }

    public void setImage_groups(List<ImageGroup> image_groups) {
        this.image_groups = image_groups;
    }
}
