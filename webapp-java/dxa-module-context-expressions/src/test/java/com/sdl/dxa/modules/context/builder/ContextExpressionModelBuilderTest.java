package com.sdl.dxa.modules.context.builder;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import com.sdl.dxa.api.datamodel.model.EntityModelData;
import com.sdl.dxa.modules.context.model.Conditions;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.exceptions.DxaException;
import org.dd4t.contentmodel.ComponentPresentation;
import org.dd4t.contentmodel.FieldSet;
import org.dd4t.contentmodel.impl.ComponentImpl;
import org.dd4t.contentmodel.impl.TextField;
import org.junit.Test;

import java.util.Collections;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ContextExpressionModelBuilderTest {

    @Test
    public void shouldNotChangeEntityBecauseNoCpPassed() throws Exception {
        //given
        ContextExpressionModelBuilder builder = new ContextExpressionModelBuilder();
        TestEntity testEntity = new TestEntity();

        //when
        EntityModel entity = builder.createEntity(new ComponentImpl(), testEntity, null);

        //then
        assertSame(testEntity, entity);
    }

    @Test
    public void shouldNotChangeEntityBecauseNoCpPassed2() throws Exception {
        //given
        ContextExpressionModelBuilder builder = new ContextExpressionModelBuilder();
        TestEntity testEntity = new TestEntity();

        //when
        EntityModel entity = builder.createEntity(new ComponentImpl(), testEntity, null, AbstractEntityModel.class);

        //then
        assertSame(testEntity, entity);
    }

    @Test
    public void shouldNotChangeEntityBecauseExtensionDataIsNullOrHasNoContextExpressions() throws Exception {
        //given
        ContextExpressionModelBuilder builder = new ContextExpressionModelBuilder();
        ComponentPresentation cp = mock(ComponentPresentation.class);
        TestEntity testEntity = new TestEntity();

        EntityModelData entityModelData = new EntityModelData();

        //when
        EntityModel entity = builder.createEntity(cp, testEntity, null);
        EntityModel entityR2 = builder.buildEntityModel(testEntity, entityModelData, null);

        //then
        assertSame(testEntity, entity);
        assertSame(testEntity, entityR2);

        //when
        when(cp.getExtensionData()).thenReturn(Collections.emptyMap());
        entity = builder.createEntity(cp, testEntity, null);

        entityModelData = EntityModelData.builder().extensionData(Collections.emptyMap()).build();
        entityR2 = builder.buildEntityModel(testEntity, entityModelData, null);

        //then
        assertSame(testEntity, entity);
        assertSame(testEntity, entityR2);
    }

    @Test
    public void shouldParseAllConditions() throws DxaException {
        //given
        List<String> includesList = Lists.newArrayList("include1", "include2");
        List<String> excludesList = Lists.newArrayList("exclude1", "exclude2");


        ContextExpressionModelBuilder builder = new ContextExpressionModelBuilder();
        ComponentPresentation cp = mock(ComponentPresentation.class);
        TextField includes = new TextField();
        includes.setTextValues(includesList);
        TextField excludes = new TextField();
        excludes.setTextValues(excludesList);
        FieldSet ce = mock(FieldSet.class);
        when(cp.getExtensionData()).thenReturn(ImmutableMap.of("ContextExpressions", ce));
        when(ce.getContent()).thenReturn(ImmutableMap.of("Include", includes, "Exclude", excludes));
        TestEntity testEntity = new TestEntity();


        EntityModelData entityModelData = EntityModelData.builder()
                .extensionData(ImmutableMap.of("ContextExpressions", ImmutableMap.of(
                        "Include", includesList,
                        "Exclude", excludesList
                ))).build();


        //when
        EntityModel entity = builder.createEntity(cp, testEntity, null);
        EntityModel entityR2 = builder.buildEntityModel(testEntity, entityModelData, null);

        //then
        Conditions conditions = (Conditions) testEntity.getExtensionData().get("ContextExpressions");
        assertTrue(conditions.getExcludes().contains("exclude1"));
        assertTrue(conditions.getExcludes().contains("exclude2"));
        assertTrue(conditions.getIncludes().contains("include1"));
        assertTrue(conditions.getIncludes().contains("include2"));
        assertEquals(entityR2, entity);

    }

    @Test
    public void shouldNotHaveHighPriority() {
        assertTrue(new ContextExpressionModelBuilder().getOrder() >= 0);
    }

    private static class TestEntity extends AbstractEntityModel {

    }

}