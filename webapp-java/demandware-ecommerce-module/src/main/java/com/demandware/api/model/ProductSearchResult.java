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
import java.util.Map;

/**
 * ProductSearchResult
 *
 * @author nic
 */
public class ProductSearchResult {

    private int count;
    private int total;
    private int start;
    private String next;
    private String previous;
    private List<ProductSearchHit> hits;
    private List<ProductSearchRefinement> refinements;
    private Map<String,String> selected_refinements;

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public String getNext() {
        return next;
    }

    public void setNext(String next) {
        this.next = next;
    }

    public String getPrevious() {
        return previous;
    }

    public void setPrevious(String previous) {
        this.previous = previous;
    }

    public List<ProductSearchHit> getHits() {
        return hits;
    }

    public void setHits(List<ProductSearchHit> hits) {
        this.hits = hits;
    }

    public List<ProductSearchRefinement> getRefinements() {
        return refinements;
    }

    public void setRefinements(List<ProductSearchRefinement> refinements) {
        this.refinements = refinements;
    }

    public Map<String, String> getSelected_refinements() {
        return selected_refinements;
    }

    public void setSelected_refinements(Map<String, String> selected_refinements) {
        this.selected_refinements = selected_refinements;
    }
}
