package com.sdl.dxa.modules.context.builder;

import org.junit.Assert;
import org.junit.Test;

public class AbstractContextExpressionModelBuilderTest {

    @Test
    public void shouldNotHaveHighPriority() {
        Assert.assertTrue(new AbstractContextExpressionModelBuilder() {
        }.getOrder() >= 0);
    }
}