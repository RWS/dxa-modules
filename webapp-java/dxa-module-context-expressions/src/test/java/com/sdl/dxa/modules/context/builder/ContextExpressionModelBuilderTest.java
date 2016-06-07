package com.sdl.dxa.modules.context.builder;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import com.sdl.dxa.modules.context.model.Conditions;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.entity.Article;
import org.dd4t.contentmodel.ComponentPresentation;
import org.dd4t.contentmodel.Field;
import org.dd4t.contentmodel.FieldSet;
import org.dd4t.contentmodel.impl.ComponentImpl;
import org.dd4t.contentmodel.impl.TextField;
import org.junit.Test;

import java.util.Collections;

import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ContextExpressionModelBuilderTest {

    @Test
    public void shouldNotChangeEntityBecauseNoCpPassed() throws Exception {
        //given
        ContextExpressionModelBuilder builder = new ContextExpressionModelBuilder();
        Article article = new Article();

        //when
        EntityModel entity = builder.createEntity(new ComponentImpl(), article, null);

        //then
        assertSame(article, entity);
    }

    @Test
    public void shouldNotChangeEntityBecauseNoCpPassed2() throws Exception {
        //given
        ContextExpressionModelBuilder builder = new ContextExpressionModelBuilder();
        Article article = new Article();

        //when
        EntityModel entity = builder.createEntity(new ComponentImpl(), article, null, AbstractEntityModel.class);

        //then
        assertSame(article, entity);
    }

    @Test
    public void shouldNotChangeEntityBecauseExtensionDataIsNullOrHasNoContextExpressions() throws Exception {
        //given
        ContextExpressionModelBuilder builder = new ContextExpressionModelBuilder();
        ComponentPresentation cp = mock(ComponentPresentation.class);
        Article article = new Article();

        //when
        EntityModel entity = builder.createEntity(cp, article, null);

        //then
        assertSame(article, entity);

        //when
        when(cp.getExtensionData()).thenReturn(Collections.<String, FieldSet>emptyMap());
        entity = builder.createEntity(cp, article, null);

        //then
        assertSame(article, entity);
    }


    @Test
    public void shouldParseAllConditions() throws ContentProviderException {
        //given
        ContextExpressionModelBuilder builder = new ContextExpressionModelBuilder();
        ComponentPresentation cp = mock(ComponentPresentation.class);
        TextField includes = new TextField();
        includes.setTextValues(Lists.newArrayList("include1", "include2"));
        TextField excludes = new TextField();
        excludes.setTextValues(Lists.newArrayList("exclude1", "exclude2"));
        FieldSet ce = mock(FieldSet.class);
        when(cp.getExtensionData()).thenReturn(ImmutableMap.of("ContextExpressions", ce));
        when(ce.getContent()).thenReturn(ImmutableMap.of("Include", (Field) includes, "Exclude", excludes));
        Article article = new Article();

        //when
        EntityModel entity = builder.createEntity(cp, article, null);

        //then
        Conditions conditions = (Conditions) article.getExtensionData().get("ContextExpressions");
        assertTrue(conditions.getExcludes().contains("exclude1"));
        assertTrue(conditions.getExcludes().contains("exclude2"));
        assertTrue(conditions.getIncludes().contains("include1"));
        assertTrue(conditions.getIncludes().contains("include2"));

    }

}