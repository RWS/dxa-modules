package com.sdl.dxa.modules.context.builder;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import com.sdl.dxa.modules.context.model.Conditions;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.exceptions.DxaException;
import org.dd4t.contentmodel.ComponentPresentation;
import org.dd4t.contentmodel.FieldSet;
import org.dd4t.contentmodel.impl.ComponentImpl;
import org.dd4t.contentmodel.impl.TextField;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mockito;

import java.util.Collections;
import java.util.List;

public class ContextExpressionModelBuilderTest {

    @Test
    public void shouldNotChangeEntityBecauseNoCpPassed() throws Exception {
        //given
        ContextExpressionModelBuilder builder = new ContextExpressionModelBuilder();
        TestEntity testEntity = new TestEntity();

        //when
        EntityModel entity = builder.createEntity(new ComponentImpl(), testEntity, null);

        //then
        Assert.assertSame(testEntity, entity);
    }

    @Test
    public void shouldNotChangeEntityBecauseNoCpPassed2() throws Exception {
        //given
        ContextExpressionModelBuilder builder = new ContextExpressionModelBuilder();
        TestEntity testEntity = new TestEntity();

        //when
        EntityModel entity = builder.createEntity(new ComponentImpl(), testEntity, null, AbstractEntityModel.class);

        //then
        Assert.assertSame(testEntity, entity);
    }

    @Test
    public void shouldNotChangeEntityBecauseExtensionDataIsNullOrHasNoContextExpressions() throws Exception {
        //given
        ContextExpressionModelBuilder builder = new ContextExpressionModelBuilder();
        ComponentPresentation cp = Mockito.mock(ComponentPresentation.class);
        TestEntity testEntity = new TestEntity();

        //when
        EntityModel entity = builder.createEntity(cp, testEntity, null);

        //then
        Assert.assertSame(testEntity, entity);

        //when
        Mockito.when(cp.getExtensionData()).thenReturn(Collections.emptyMap());
        entity = builder.createEntity(cp, testEntity, null);

        //then
        Assert.assertSame(testEntity, entity);
    }

    @Test
    public void shouldParseAllConditions() throws DxaException {
        //given
        List<String> includesList = Lists.newArrayList("include1", "include2");
        List<String> excludesList = Lists.newArrayList("exclude1", "exclude2");

        ContextExpressionModelBuilder builder = new ContextExpressionModelBuilder();
        ComponentPresentation cp = Mockito.mock(ComponentPresentation.class);
        TextField includes = new TextField();
        includes.setTextValues(includesList);
        TextField excludes = new TextField();
        excludes.setTextValues(excludesList);
        FieldSet ce = Mockito.mock(FieldSet.class);
        Mockito.when(cp.getExtensionData()).thenReturn(ImmutableMap.of("ContextExpressions", ce));
        Mockito.when(ce.getContent()).thenReturn(ImmutableMap.of("Include", includes, "Exclude", excludes));
        TestEntity testEntity = new TestEntity();

        //when
        EntityModel entity = builder.createEntity(cp, testEntity, null);

        //then
        Conditions conditions = (Conditions) entity.getExtensionData().get("ContextExpressions");
        Assert.assertTrue(conditions.getExcludes().contains("exclude1"));
        Assert.assertTrue(conditions.getExcludes().contains("exclude2"));
        Assert.assertTrue(conditions.getIncludes().contains("include1"));
        Assert.assertTrue(conditions.getIncludes().contains("include2"));

    }

    private static class TestEntity extends AbstractEntityModel {

    }
}