package com.sdl.dxa.modules.context.builder;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import com.sdl.dxa.api.datamodel.model.EntityModelData;
import com.sdl.dxa.api.datamodel.model.util.ListWrapper;
import com.sdl.dxa.modules.context.model.Conditions;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.exceptions.DxaException;
import org.junit.Assert;
import org.junit.Test;

import java.util.Collections;

public class ContextExpressionModelBuilderTest {

    @Test
    public void shouldNotChangeEntityBecauseExtensionDataIsNullOrHasNoContextExpressions() throws Exception {
        //given
        ContextExpressionModelBuilder builder = new ContextExpressionModelBuilder();
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

        ContextExpressionModelBuilder builder = new ContextExpressionModelBuilder();
        TestEntity testEntity = new TestEntity();

        EntityModelData entityModelData = EntityModelData.builder()
                .extensionData(ImmutableMap.of("CX.Include", includesList, "CX.Exclude", excludesList)).build();

        //when
        EntityModel entityR2 = builder.buildEntityModel(testEntity, entityModelData, null);

        //then
        Conditions conditions = (Conditions) entityR2.getExtensionData().get("ContextExpressions");
        org.junit.Assert.assertTrue(conditions.getExcludes().contains("exclude1"));
        org.junit.Assert.assertTrue(conditions.getExcludes().contains("exclude2"));
        org.junit.Assert.assertTrue(conditions.getIncludes().contains("include1"));
        org.junit.Assert.assertTrue(conditions.getIncludes().contains("include2"));

    }
    private static class TestEntity extends AbstractEntityModel {

    }
}