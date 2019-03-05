package com.sdl.dxa.modules.context.content;

import com.google.common.collect.ImmutableMap;
import com.sdl.dxa.modules.context.model.Conditions;
import com.sdl.webapp.common.api.contextengine.ContextClaimsProvider;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.exceptions.DxaException;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import static com.google.common.collect.Sets.newHashSet;
import static junit.framework.TestCase.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
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
    public void shouldIncludeIfNoExtensionData() throws Exception {
        //given
        ContextExpressionEntityEvaluator evaluator = new ContextExpressionEntityEvaluator();

        //when
        boolean includeEntity = evaluator.includeEntity(new TestEntity());

        //then
        assertTrue("No extension data = include entity", includeEntity);
    }

    @Test
    public void shouldIncludeIfNoContextExpressions() throws Exception {
        //given
        ContextExpressionEntityEvaluator evaluator = new ContextExpressionEntityEvaluator();
        ReflectionTestUtils.setField(evaluator, "contextExpressionsKey", CONTEXT_EXPRESSIONS_KEY);

        TestEntity entity = new TestEntity();
        entity.setExtensionData(Collections.emptyMap());

        //when
        boolean includeEntity = evaluator.includeEntity(entity);

        //then
        assertTrue("isAndroid shouldn't include IPhone", includeEntity);
    }

    @Test
    public void testIncludeMobileShouldWorkForIPhone() throws Exception {
        //given
        ContextExpressionEntityEvaluator evaluator = new ContextExpressionEntityEvaluator();
        ReflectionTestUtils.setField(evaluator, "contextExpressionsKey", CONTEXT_EXPRESSIONS_KEY);

        ContextClaimsProvider contextClaimsProvider = mock(ContextClaimsProvider.class);
        when(contextClaimsProvider.getContextClaims(any())).thenReturn(getContextClaimsForIPhone());
        ReflectionTestUtils.setField(evaluator, "contextClaimsProvider", contextClaimsProvider);

        HashSet<String> includes = new HashSet<>();
        includes.add("cx.isMobile");
        HashSet<String> excludes = new HashSet<>();

        Conditions conditions = new Conditions(includes, excludes);
        TestEntity entity = new TestEntity();
        HashMap<String, Object> extensionData = new HashMap<>();
        extensionData.put("ContextExpressions", conditions);
        entity.setExtensionData(extensionData);

        //when
        boolean includeEntity = evaluator.includeEntity(entity);

        //then
        assertTrue("isMobile should include IPhone", includeEntity);
    }

    @Test
    public void testIncludeMobileAndAppleShouldWorkForIPhone() throws Exception {
        //given
        ContextExpressionEntityEvaluator evaluator = new ContextExpressionEntityEvaluator();
        ReflectionTestUtils.setField(evaluator, "contextExpressionsKey", CONTEXT_EXPRESSIONS_KEY);

        ContextClaimsProvider contextClaimsProvider = mock(ContextClaimsProvider.class);
        when(contextClaimsProvider.getContextClaims(any())).thenReturn(getContextClaimsForIPhone());
        ReflectionTestUtils.setField(evaluator, "contextClaimsProvider", contextClaimsProvider);

        HashSet<String> includes = new HashSet<>();
        includes.add("cx.isApple");
        includes.add("cx.isMobile");
        HashSet<String> excludes = new HashSet<>();

        Conditions conditions = new Conditions(includes, excludes);
        TestEntity entity = new TestEntity();
        HashMap<String, Object> extensionData = new HashMap<>();
        extensionData.put("ContextExpressions", conditions);
        entity.setExtensionData(extensionData);

        //when
        boolean includeEntity = evaluator.includeEntity(entity);

        //then
        assertTrue("isMobile and isApple should include IPhone", includeEntity);
    }

    @Test
    public void testIncludeAndroidShouldNotWorkForIPhone() throws Exception {
        //given
        ContextExpressionEntityEvaluator evaluator = new ContextExpressionEntityEvaluator();
        ReflectionTestUtils.setField(evaluator, "contextExpressionsKey", CONTEXT_EXPRESSIONS_KEY);

        ContextClaimsProvider contextClaimsProvider = mock(ContextClaimsProvider.class);
        when(contextClaimsProvider.getContextClaims(any())).thenReturn(getContextClaimsForIPhone());
        ReflectionTestUtils.setField(evaluator, "contextClaimsProvider", contextClaimsProvider);

        HashSet<String> includes = new HashSet<>();
        includes.add("cx.isAndroid");
        HashSet<String> excludes = new HashSet<>();

        Conditions conditions = new Conditions(includes, excludes);
        TestEntity entity = new TestEntity();
        HashMap<String, Object> extensionData = new HashMap<>();
        extensionData.put("ContextExpressions", conditions);
        entity.setExtensionData(extensionData);

        //when
        boolean includeEntity = evaluator.includeEntity(entity);

        //then
        assertFalse("isAndroid shouldn't include IPhone", includeEntity);
    }

    @Test
    public void testIncludeMobileOrAndroidShouldWorkForIPhone() throws Exception {
        //given
        ContextExpressionEntityEvaluator evaluator = new ContextExpressionEntityEvaluator();
        ReflectionTestUtils.setField(evaluator, "contextExpressionsKey", CONTEXT_EXPRESSIONS_KEY);

        ContextClaimsProvider contextClaimsProvider = mock(ContextClaimsProvider.class);
        when(contextClaimsProvider.getContextClaims(any())).thenReturn(getContextClaimsForIPhone());
        ReflectionTestUtils.setField(evaluator, "contextClaimsProvider", contextClaimsProvider);

        HashSet<String> includes = new HashSet<>();
        includes.add("cx.isAndroid");
        includes.add("cx.isMobile");
        HashSet<String> excludes = new HashSet<>();

        Conditions conditions = new Conditions(includes, excludes);
        TestEntity entity = new TestEntity();
        HashMap<String, Object> extensionData = new HashMap<>();
        extensionData.put("ContextExpressions", conditions);
        entity.setExtensionData(extensionData);

        //when
        boolean includeEntity = evaluator.includeEntity(entity);

        //then
        assertTrue("isAndroid and isMobile should include IPhone", includeEntity);
    }

    @Test
    public void testIncludeMobileExcludeAndroidShouldWorkForIPhone() throws Exception {
        //given
        ContextExpressionEntityEvaluator evaluator = new ContextExpressionEntityEvaluator();
        ReflectionTestUtils.setField(evaluator, "contextExpressionsKey", CONTEXT_EXPRESSIONS_KEY);

        ContextClaimsProvider contextClaimsProvider = mock(ContextClaimsProvider.class);
        when(contextClaimsProvider.getContextClaims(any())).thenReturn(getContextClaimsForIPhone());
        ReflectionTestUtils.setField(evaluator, "contextClaimsProvider", contextClaimsProvider);

        HashSet<String> includes = new HashSet<>();
        includes.add("cx.isMobile");
        HashSet<String> excludes = new HashSet<>();
        excludes.add("cx.isAndroid");

        Conditions conditions = new Conditions(includes, excludes);
        TestEntity entity = new TestEntity();
        HashMap<String, Object> extensionData = new HashMap<>();
        extensionData.put("ContextExpressions", conditions);
        entity.setExtensionData(extensionData);

        //when
        boolean includeEntity = evaluator.includeEntity(entity);

        //then
        assertTrue("exclude isAndroid and include isMobile should include IPhone", includeEntity);
    }

    @Test(expected = NullPointerException.class)
    public void shouldNPEIfEntityIsNull() throws Exception {
        //given
        ContextExpressionEntityEvaluator evaluator = new ContextExpressionEntityEvaluator();

        //when
        evaluator.includeEntity(null);

        //then
        //exception
    }

    @SuppressWarnings("ConstantConditions")
    @Test
    public void shouldIncludeIfConditionsNull() throws Exception {
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
    public void shouldIncludeIfConditionsEmpty() throws Exception {
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

        boolean with(Set<String> includes, Set<String> excludes) throws Exception {
            return evaluator.includeEntity(entityWithCx(includes, excludes));
        }

        private EntityModel entityWithCx(Set<String> includes, Set<String> excludes) {
            TestEntity entity = new TestEntity();
            entity.setExtensionData(ImmutableMap.of(CONTEXT_EXPRESSIONS_KEY, new Conditions(includes, excludes)));
            return entity;
        }
    }

    /**
     * This is the set of ContextClaims you get back for an Apple IPhone 5 with user agent
     * "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
     * @return ContextClaims
     */
    @NotNull
    private HashMap<String, Object> getContextClaimsForIPhone() {
        HashMap<String, Object> contextClaims = new HashMap<>();
        contextClaims.put("os.vendor", "Apple");
        contextClaims.put("device.pixelDensity", "217");
        contextClaims.put("browser.displayHeight", "1089");
        contextClaims.put("browser.modelAndOS", "iOS Mobile Safari");
        contextClaims.put("device.displayHeight", "1200");
        contextClaims.put("userServer.serverPort", "");
        contextClaims.put("device.tablet", "false");
        contextClaims.put("browser.inputDevices", "[touchScreen]");
        contextClaims.put("os.version", "9.1");
        contextClaims.put("device.displayWidth", "1920");
        contextClaims.put("device.pixelRatio", "1.0");
        contextClaims.put("device.variant", "");
        contextClaims.put("userRequest.fullUrl", "");
        contextClaims.put("os.variant", "");
        contextClaims.put("browser.version", "9.0");
        contextClaims.put("browser.markupSupport", "[HTML5]");
        contextClaims.put("ui.android", "false");
        contextClaims.put("device.version", "");
        contextClaims.put("browser.jsVersion", "1.5");
        contextClaims.put("browser.variant", "");
        contextClaims.put("browser.displayColorDepth", "24");
        contextClaims.put("browser.vendor", "Apple");
        contextClaims.put("browser.stylesheetSupport", "[css10, css21]");
        contextClaims.put("browser.inputModeSupport", "[useInputmodeAttribute]");
        contextClaims.put("browser.cookieSupport", "true");
        contextClaims.put("browser.scriptSupport", "[JavaScript]");
        contextClaims.put("browser.imageFormatSupport", "[PNG, JPEG]");
        contextClaims.put("os.model", "iOS");
        contextClaims.put("cx.isAndroid", "false");
        contextClaims.put("browser.cssVersion", "2.1");
        contextClaims.put("userServer.remoteUser", "");
        contextClaims.put("cx.isMobile", "true");
        contextClaims.put("browser.preferredHtmlContentType", "text/html");
        contextClaims.put("ui.largeBrowser", "true");
        contextClaims.put("cx.isChrome", "false");
        contextClaims.put("browser.displayWidth", "1920");
        contextClaims.put("userHttp.cacheControl", "");
        contextClaims.put("device.inputDevices", "[touchScreen]");
        contextClaims.put("cx.isApple", "true");
        contextClaims.put("device.4g", "false");
        contextClaims.put("device.model", "iPhone");
        contextClaims.put("device.vendor", "Apple");
        contextClaims.put("browser.model", "Mobile Safari");
        contextClaims.put("device.mobile", "true");
        contextClaims.put("device.robot", "false");
        return contextClaims;
    }
}