package com.sdl.dxa.modules.context.content;

import com.google.common.collect.ImmutableMap;
import com.sdl.dxa.modules.context.model.Conditions;
import com.sdl.webapp.common.api.contextengine.ContextClaimsProvider;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.exceptions.DxaException;
import lombok.AllArgsConstructor;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.HashMap;
import java.util.Set;

import static com.google.common.collect.Sets.newHashSet;
import static junit.framework.TestCase.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ContextExpressionEntityEvaluatorTest {

    private static final String CONTEXT_EXPRESSIONS_KEY = "ContextExpressions";

    @Test
    public void shouldIncludeOrExcludeEntity() throws Exception {
        //given
        ContextExpressionEntityEvaluator entityEvaluator = new ContextExpressionEntityEvaluator();
        ContextClaimsProvider contextClaimsProvider = mock(ContextClaimsProvider.class);
        when(contextClaimsProvider.getContextClaims(anyString())).thenReturn(
                ImmutableMap.of(
                        "cx.android", true,
                        "cx.apple", false,
                        "cx.samsung", true,
                        "cx.ios", false));
        ReflectionTestUtils.setField(entityEvaluator, "contextClaimsProvider", contextClaimsProvider);

        TestEvaluatorWrapper eval = new TestEvaluatorWrapper(entityEvaluator);

        assertTrue("Any TRUE include without excludes = include", eval.with(newHashSet("cx.apple", "cx.android"), null));
        assertTrue("NO TRUE exclude, without includes = include", eval.with(null, newHashSet("cx.ios")));
        assertFalse("Any TRUE exclude = exclude", eval.with(null, newHashSet("cx.samsung", "cx.ios")));
        assertFalse("Any TRUE exclude, even with includes = exclude", eval.with(newHashSet("cx.android"), newHashSet("cx.samsung")));
        assertFalse("Any TRUE exclude, NO includes = exclude", eval.with(newHashSet("cx.apple"), newHashSet("cx.samsung")));
        assertFalse("NO TRUE include = exclude", eval.with(newHashSet("cx.apple"), null));
        assertFalse("NO TRUE includes, NO TRUE excludes = exclude", eval.with(newHashSet("cx.apple"), newHashSet("cx.ios")));

        assertTrue("NOT EXISTING include, no excludes = include", eval.with(newHashSet("hello.world"), null));
        assertTrue("NOT EXISTING exclude, no includes = include", eval.with(null, newHashSet("hello.world")));
        assertTrue("NOT EXISTING exclude, TRUE include = include", eval.with(newHashSet("cx.android"), newHashSet("hello.world")));
        assertFalse("NOT EXISTING include, TRUE exclude = exclude", eval.with(newHashSet("hello.world"), newHashSet("cx.samsung")));
    }

    @Test
    public void shouldIncludeIfNoExtensionData() {
        //given
        ContextExpressionEntityEvaluator evaluator = new ContextExpressionEntityEvaluator();

        //when
        boolean includeEntity = evaluator.includeEntity(new TestEntity());

        //then
        assertTrue("No extension data = include entity", includeEntity);
    }

    @Test
    public void shouldIncludeIfNoContextExpressions() {
        //given
        ContextExpressionEntityEvaluator evaluator = new ContextExpressionEntityEvaluator();
        ReflectionTestUtils.setField(evaluator, "contextExpressionsKey", CONTEXT_EXPRESSIONS_KEY);

        TestEntity entity = new TestEntity();
        entity.setExtensionData(Collections.emptyMap());

        //when
        boolean includeEntity = evaluator.includeEntity(entity);

        //then
        assertTrue("No ContextExpressions = include entity", includeEntity);
    }

    @Test(expected = NullPointerException.class)
    public void shouldNPEIfEntityIsNull() {
        //given
        ContextExpressionEntityEvaluator evaluator = new ContextExpressionEntityEvaluator();

        //when
        evaluator.includeEntity(null);

        //then
        //exception
    }

    @SuppressWarnings("ConstantConditions")
    @Test
    public void shouldIncludeIfConditionsNull() {
        //given
        ContextExpressionEntityEvaluator evaluator = new ContextExpressionEntityEvaluator();
        ReflectionTestUtils.setField(evaluator, "contextExpressionsKey", CONTEXT_EXPRESSIONS_KEY);

        TestEntity entity = new TestEntity();
        entity.setExtensionData(new HashMap<String, Object>() {{
            put(CONTEXT_EXPRESSIONS_KEY, null);
        }});

        //when
        boolean includeEntity = evaluator.includeEntity(entity);

        //then
        assertTrue("Null ContextExpressions = include entity", includeEntity);
    }

    @Test
    public void shouldIncludeIfConditionsEmpty() {
        //given
        ContextExpressionEntityEvaluator evaluator = new ContextExpressionEntityEvaluator();
        ReflectionTestUtils.setField(evaluator, "contextExpressionsKey", CONTEXT_EXPRESSIONS_KEY);

        TestEntity entity = new TestEntity();
        entity.setExtensionData(ImmutableMap.of(CONTEXT_EXPRESSIONS_KEY, new Conditions(null, null)));

        //when
        boolean includeEntity = evaluator.includeEntity(entity);

        //then
        assertTrue("Empty ContextExpressions = include entity", includeEntity);
    }

    @Test
    public void shouldIncludeIfExceptionContextClaims() throws DxaException {
        //given
        ContextExpressionEntityEvaluator evaluator = new ContextExpressionEntityEvaluator();
        ReflectionTestUtils.setField(evaluator, "contextExpressionsKey", CONTEXT_EXPRESSIONS_KEY);
        ContextClaimsProvider contextClaimsProvider = mock(ContextClaimsProvider.class);
        when(contextClaimsProvider.getContextClaims(anyString())).thenThrow(new DxaException("Test"));
        ReflectionTestUtils.setField(evaluator, "contextClaimsProvider", contextClaimsProvider);

        TestEntity entity = new TestEntity();
        entity.setExtensionData(ImmutableMap.of(CONTEXT_EXPRESSIONS_KEY,
                new Conditions(newHashSet("contextepr.apple"), null)));

        //when
        boolean includeEntity = evaluator.includeEntity(entity);

        //then
        assertTrue("ContextClaims exception = include entity", includeEntity);
    }

    private static class TestEntity extends AbstractEntityModel {

    }

    @AllArgsConstructor
    private static class TestEvaluatorWrapper {

        private ContextExpressionEntityEvaluator evaluator;

        boolean with(Set<String> includes, Set<String> excludes) {
            return evaluator.includeEntity(entityWithCx(includes, excludes));
        }

        private EntityModel entityWithCx(Set<String> includes, Set<String> excludes) {
            TestEntity entity = new TestEntity();
            entity.setExtensionData(ImmutableMap.of(
                    CONTEXT_EXPRESSIONS_KEY, new Conditions(includes, excludes)));
            return entity;
        }
    }

}