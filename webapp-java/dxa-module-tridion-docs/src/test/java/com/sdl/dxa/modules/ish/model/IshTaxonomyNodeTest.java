package com.sdl.dxa.modules.ish.model;

import com.sdl.webapp.common.api.model.entity.SitemapItem;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.Assert.assertEquals;

/**
 * IshTaxonomyNode test.
 */
@RunWith(MockitoJUnitRunner.class)
public class IshTaxonomyNodeTest {

    private Set<SitemapItem> tocItems;
    private SitemapItem item1;
    private SitemapItem item2;
    private SitemapItem item3;
    private SitemapItem item4;
    private SitemapItem item5;

    @Before
    public void setup() {
        tocItems = new HashSet<>();
        item5 = new SitemapItem();
        item5.setId("t1-k2");
        item1 = new SitemapItem();
        item1.setId("t1-k10");
        item2 = new SitemapItem();
        item2.setId("t1-k21");
        item3 = new SitemapItem();
        item3.setId("t1-p11");
        item4 = new SitemapItem();
        item4.setId("t1-p41");
        Collections.addAll(tocItems, item3, item2, item5, item1, item4);
    }

    @SuppressWarnings("magicnumber")
    @Test
    public void testSortById() {
        IshTaxonomyNode ishTaxonomyNode = new IshTaxonomyNode();
        ishTaxonomyNode.setItems(tocItems);
        List<SitemapItem> sortedItems = new ArrayList<>(ishTaxonomyNode.getItems());

        assertEquals(item5, sortedItems.get(0));
        assertEquals(item1, sortedItems.get(1));
        assertEquals(item2, sortedItems.get(2));
        assertEquals(item3, sortedItems.get(3));
        assertEquals(item4, sortedItems.get(4));
    }
}
