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
 * ProductSearchRefinementValue
 *
 * @author nic
 */
public class ProductSearchRefinementValue {

    private String description;
    private int hit_count;
    private String label;
    private String presentation_id;
    private String value;
    private List<ProductSearchRefinementValue> values;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getHit_count() {
        return hit_count;
    }

    public void setHit_count(int hit_count) {
        this.hit_count = hit_count;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getPresentation_id() {
        return presentation_id;
    }

    public void setPresentation_id(String presentation_id) {
        this.presentation_id = presentation_id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public List<ProductSearchRefinementValue> getValues() {
        return values;
    }

    public void setValues(List<ProductSearchRefinementValue> values) {
        this.values = values;
    }
}
