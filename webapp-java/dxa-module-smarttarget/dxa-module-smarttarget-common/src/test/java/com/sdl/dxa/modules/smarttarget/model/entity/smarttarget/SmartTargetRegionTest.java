package com.sdl.dxa.modules.smarttarget.model.entity.smarttarget;

import com.google.common.collect.ImmutableMap;
import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.api.model.mvcdata.MvcDataImpl;
import com.sdl.webapp.common.exceptions.DxaException;
import org.junit.Test;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.isEmptyString;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

public class SmartTargetRegionTest {

    @Test
    public void shouldGetXpmMarkup() throws Exception {
        //given
        SmartTargetRegion region = new SmartTargetRegion("TestRegion");

        //when
        String xpmMarkup = region.getXpmMarkup(null);

        //then
        assertEquals("<!-- Start Promotion Region: { \"RegionID\": \"TestRegion\" } -->", xpmMarkup);
    }

    @Test(expected = DxaException.class)
    public void shouldNotAllowToSetNullName() throws DxaException {
        //when
        new SmartTargetRegion(null, "Test:Test");
    }

    @Test
    public void shouldGetStartQueryXpmMarkup() throws Exception {
        //given
        SmartTargetRegion regionNoXpm = new SmartTargetRegion("name", "name:name");

        SmartTargetRegion regionOkXpm = new SmartTargetRegion("name", "name:name");
        regionOkXpm.setXpmMetadata(ImmutableMap.<String, Object>builder().put("Query", "hello world").build());

        SmartTargetRegion regionBadXpm = new SmartTargetRegion("name", "name:name");
        regionBadXpm.setXpmMetadata(ImmutableMap.<String, Object>builder().put("Asd", "hello world").build());

        //when
        String noXpm = regionNoXpm.getStartQueryXpmMarkup();
        String okXpm = regionOkXpm.getStartQueryXpmMarkup();
        String badXpm = regionBadXpm.getStartQueryXpmMarkup();

        //then
        assertEquals("hello world", okXpm);
        assertThat(noXpm, allOf(isEmptyString(), notNullValue()));
        assertThat(badXpm, allOf(isEmptyString(), notNullValue()));
    }

    @Test
    public void shouldCreateFromMvcData() throws DxaException {
        //given
        MvcData mvcData = new MvcDataImpl.MvcDataImplBuilder().regionName("RegionName").build();

        //when
        SmartTargetRegion region = new SmartTargetRegion(mvcData);

        //then
        assertEquals("RegionName", region.getName());
        assertEquals(mvcData, region.getMvcData());
    }
}
