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
 * ProductSearchRefinement
 *
 * @author nic
 */
public class ProductSearchRefinement {

    private String attribute_id;
    private String label;
    private List<ProductSearchRefinementValue> values;

    public String getAttribute_id() {
        return attribute_id;
    }

    public void setAttribute_id(String attribute_id) {
        this.attribute_id = attribute_id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public List<ProductSearchRefinementValue> getValues() {
        return values;
    }

    public void setValues(List<ProductSearchRefinementValue> values) {
        this.values = values;
    }
}
