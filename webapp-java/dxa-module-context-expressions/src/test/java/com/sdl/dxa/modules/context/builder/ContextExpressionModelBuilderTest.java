package com.sdl.dxa.modules.context.builder;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import com.sdl.dxa.api.datamodel.model.ContentModelData;
import com.sdl.dxa.api.datamodel.model.EntityModelData;
import com.sdl.dxa.api.datamodel.model.util.ListWrapper;
import com.sdl.dxa.caching.wrapper.EntitiesCache;
import com.sdl.dxa.modules.context.model.Conditions;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.exceptions.DxaException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyVararg;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;

public class ContextExpressionModelBuilderTest {

    private ContextExpressionModelBuilder builder;

    @Before
    public void init() {
        EntitiesCache cache = spy(EntitiesCache.class);
        doReturn(null).when(cache).getSpecificKey(any(), anyVararg());
        doReturn(false).when(cache).containsKey(any());
        doReturn(false).when(cache).isCachingEnabled();


        builder = new ContextExpressionModelBuilder(cache);
        ReflectionTestUtils.setField(builder, "entitiesCache", cache);
    }

    @Test
    public void shouldNotChangeEntityBecauseExtensionDataIsNullOrHasNoContextExpressions() throws Exception {
        //given
        TestEntity testEntity = new TestEntity();

        EntityModelData entityModelData = new EntityModelData();

        //when
        EntityModel entityR2 = builder.buildEntityModel(testEntity, entityModelData, null);

        //then
        Assert.assertSame(testEntity, entityR2);

        //when
        entityModelData = EntityModelData.builder().extensionData(Collections.emptyMap()).build();
        entityR2 = builder.buildEntityModel(testEntity, entityModelData, null);

        //then
        Assert.assertSame(testEntity, entityR2);
    }

    @Test
    public void shouldParseAllConditions() throws DxaException {
        //given
        ListWrapper<String> includesList = new ListWrapper<>(Lists.newArrayList("include1", "include2"));
        ListWrapper<String> excludesList = new ListWrapper<>(Lists.newArrayList("exclude1", "exclude2"));

        TestEntity testEntity = new TestEntity();
        EntityModelData entityModelData = EntityModelData.builder()
                .extensionData(ImmutableMap.of("ContextExpressions", new ContentModelData(ImmutableMap.of("Include", includesList, "Exclude", excludesList))))
                .build();

        //when
        EntityModel entityR2 = builder.buildEntityModel(testEntity, entityModelData, null);

        //then
        Conditions conditions = (Conditions) entityR2.getExtensionData().get("ContextExpressions");
        assertTrue(conditions.getExcludes().contains("exclude1"));
        assertTrue(conditions.getExcludes().contains("exclude2"));
        assertTrue(conditions.getIncludes().contains("include1"));
        assertTrue(conditions.getIncludes().contains("include2"));

    }

    @Test
    public void shouldSupportSingleValue_InCX() throws DxaException {
        //given
        TestEntity testEntity = new TestEntity();
        EntityModelData entityModelData = EntityModelData.builder()
                .extensionData(ImmutableMap.of("ContextExpressions", new ContentModelData(ImmutableMap.of("Include", "include1", "Exclude", "exclude1"))))
                .build();
        //when
        TestEntity entityR2 = builder.buildEntityModel(testEntity, entityModelData, null);

        //then
        Conditions conditions = (Conditions) entityR2.getExtensionData().get("ContextExpressions");
        assertTrue(conditions.getIncludes().contains("include1"));
        assertTrue(conditions.getExcludes().contains("exclude1"));
    }

    @Test
    public void shouldSupportLists_EvenWithSingleValue_InCX() throws DxaException {
        //given
        ListWrapper<String> includesList = new ListWrapper<>(Lists.newArrayList("include1"));
        ListWrapper<String> excludesList = new ListWrapper<>(Lists.newArrayList("exclude1"));

        TestEntity testEntity = new TestEntity();
        EntityModelData entityModelData = EntityModelData.builder()
                .extensionData(ImmutableMap.of("ContextExpressions", new ContentModelData(ImmutableMap.of("Include", includesList, "Exclude", excludesList))))
                .build();

        //when
        EntityModel entityR2 = builder.buildEntityModel(testEntity, entityModelData, null);

        //then
        Conditions conditions = (Conditions) entityR2.getExtensionData().get("ContextExpressions");
        assertTrue(conditions.getIncludes().contains("include1"));
        assertTrue(conditions.getExcludes().contains("exclude1"));
    }

    @Test
    public void shouldNotHaveHighPriority() {
        assertTrue(builder.getOrder() >= 0);
    }

    private static class TestEntity extends AbstractEntityModel {

    }
}