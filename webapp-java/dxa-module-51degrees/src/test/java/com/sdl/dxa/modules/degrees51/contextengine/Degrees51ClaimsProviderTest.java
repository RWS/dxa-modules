package com.sdl.dxa.modules.degrees51.contextengine;

import com.google.common.collect.ImmutableMap;
import com.sdl.dxa.modules.degrees51.Degrees51SpringContext;
import com.sdl.dxa.modules.degrees51.api.Degrees51DataProvider;
import fiftyone.mobile.detection.Match;
import fiftyone.mobile.detection.entities.Values;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasEntry;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(loader = AnnotationConfigContextLoader.class)
@ActiveProfiles("test")
public class Degrees51ClaimsProviderTest {

    @Autowired
    private Degrees51ClaimsProvider degrees51ClaimsProvider;

    @Test
    public void shouldMapKnownPropertiesFrom51DegreesToOurModel() throws IOException {
        //given
        Match match = mock(Match.class);
        //        mockMatch(match, "PlatformVendor", "Microsoft");
        mockMatch(match, "PlatformName", "Windows");
        mockMatch(match, "PlatformVersion", "8.1");

        mockMatch(match, "ScreenPixelsHeight", "640");
        mockMatch(match, "ScreenPixelsWidth", "1024");
        mockMatch(match, "BitsPerPixel", "32");
        mockMatch(match, "CookiesCapable", "True");
        mockMatch(match, "BrowserVendor", "Google");
        mockMatch(match, "BrowserVersion", "42");
        mockMatch(match, "JavascriptVersion", "2.4.5");
//        mockMatch(match, "CssVersion", "2.4.5");

        mockMatch(match, "IsMobile", "True");
        mockMatch(match, "IsCrawler", "True");
        mockMatch(match, "IsTablet", "True");
//        mockMatch(match, "PlatformVendor", "LG");
        mockMatch(match, "DeviceType", "DeviceVariant");
//        mockMatch(match, "BrowserName", "Nexus");
//        mockMatch(match, "PlatformVersion", "8.1");


        final Map<String, Object> expected =
                ImmutableMap.<String, Object>builder()
//                        .put("os.vendor", "Microsoft")
                        .put("os.model", "Windows")
                        .put("os.version", "8.1")

                        .put("browser.displayHeight", 640)
                        .put("browser.displayWidth", 1024)
                        .put("browser.displayColorDepth", 32)
                        .put("browser.cookieSupport", true)
                        .put("browser.vendor", "Google")
                        .put("browser.version", "42")
                        .put("browser.jsVersion", "2.4.5")
//                        .put("browser.cssVersion", "2.4.5")

                        .put("device.mobile", true)
                        .put("device.robot", true)
                        .put("device.tablet", true)
//                        .put("device.vendor", "LG")
                        .put("device.variant", "DeviceVariant")
//                        .put("device.model", "Nexus")
//                        .put("device.version", "5")
                        .build();

        //when
        final Map<String, Object> result = degrees51ClaimsProvider.map(match);

        //then
        for (Map.Entry<String, Object> entry : expected.entrySet()) {
            assertThat(result, hasEntry(entry.getKey(), entry.getValue()));
        }
    }

    private <T> void mockMatch(Match match, String propertyName, T value) throws IOException {
        String string = Objects.toString(value);

        Values values = mock(Values.class);
        when(match.getValues(eq(propertyName))).thenReturn(values);
        when(values.toString()).thenReturn(string);
        try {
            double aDouble = Double.parseDouble(string);
            when(values.toDouble()).thenReturn(aDouble);
        } catch (NumberFormatException ignored) {
        }
        when(values.toBool()).thenReturn(Boolean.parseBoolean(string));
    }

    @Configuration
    @Profile("test")
    public static class SpringConfigurationContext {

        @Bean
        public Degrees51ClaimsProvider degrees51ClaimsProvider() {
            return new Degrees51ClaimsProvider();
        }

        @Bean
        public Degrees51DataProvider degrees51DataProvider() {
            return null;
        }

        @Bean
        public BeanFactoryPostProcessor beanFactoryPostProcessor() {
            return new Degrees51SpringContext().beanFactoryPostProcessor();
        }
    }

}