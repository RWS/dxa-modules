package com.sdl.dxa.modules.smarttarget.model.entity;

import com.google.common.collect.ImmutableMap;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import org.hamcrest.Matchers;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static org.hamcrest.Matchers.isEmptyString;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class SmartTargetPromotionTest {

    @Test
    public void shouldGetXpmMarkup() throws Exception {
        //given
        SmartTargetPromotion promotion = new SmartTargetPromotion();
        promotion.setXpmMetadata(ImmutableMap.<String, Object>builder()
                .put("PromotionID", "promoid").put("RegionID", "regionid").build());

        //when
        String xpmMarkup = promotion.getXpmMarkup(null);

        //then
        assertEquals("<!-- Start Promotion: { \"PromotionID\": \"promoid\", \"RegionID\" : \"regionid\" } -->", xpmMarkup);
    }

    @Test
    public void shouldReturnEmptyStringForNullXpmMetadata() {
        //given
        SmartTargetPromotion promotion = new SmartTargetPromotion();

        //when
        String xpmMarkup = promotion.getXpmMarkup(null);

        //then
        assertThat(xpmMarkup, isEmptyString());
    }

    @Test
    public void shouldGetEntityModels() throws Exception {
        //given
        List<SmartTargetItem> smartTargetItems = new ArrayList<>(2);
        SmartTargetItem item = mock(SmartTargetItem.class);
        SmartTargetItem item2 = mock(SmartTargetItem.class);
        smartTargetItems.add(item);
        smartTargetItems.add(item2);

        Test1 test1 = new Test1();
        Test2 test2 = new Test2();
        when(item.getEntity()).thenReturn(test1, test2);

        Test3 test3 = new Test3();
        when(item2.getEntity()).thenReturn(test3);

        SmartTargetPromotion promotion = new SmartTargetPromotion();
        promotion.setItems(smartTargetItems);

        //when
        Collection<EntityModel> entityModels = promotion.getEntityModels();

        //then
        assertThat(entityModels, Matchers.<EntityModel>hasItems(test1, test2, test3));
    }

    private static class Test1 extends AbstractEntityModel {

    }

    private static class Test2 extends AbstractEntityModel {

    }

    private static class Test3 extends AbstractEntityModel {

    }
}
