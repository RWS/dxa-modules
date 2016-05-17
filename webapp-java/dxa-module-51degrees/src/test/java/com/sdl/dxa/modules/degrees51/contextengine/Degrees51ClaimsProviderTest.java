package com.sdl.dxa.modules.degrees51.contextengine;

import com.google.common.collect.ImmutableMap;
import com.sdl.dxa.modules.degrees51.Degrees51SpringContext;
import com.sdl.dxa.modules.degrees51.api.Degrees51DataProvider;
import com.sdl.dxa.modules.degrees51.api.mapping.Extractors;
import com.sdl.webapp.common.util.ApplicationContextHolder;
import fiftyone.mobile.detection.Match;
import fiftyone.mobile.detection.entities.Values;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
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

    @Autowired
    private HttpServletRequest httpServletRequest;

    @Test
    public void shouldMapKnownPropertiesFrom51DegreesToOurModel() throws IOException {
        //given
        ((MockHttpServletRequest) httpServletRequest).setCookies(
                new Cookie("context", "dpr~1|dw~1025|dh~641|bcd~32|bw~1024|bh~640|version~1|"));

        Match match = mock(Match.class);
        mockMatch(match, "PlatformVendor", "Microsoft");
        mockMatch(match, "PlatformName", "Windows");
        mockMatch(match, "PlatformVersion", "8.1");
        mockMatch(match, "HardwareFamily", "DeviceVariant");
        mockMatch(match, "HardwareVendor", "LG");
        mockMatch(match, "HardwareModel", "Nexus 5");
        mockMatch(match, "DeviceType", "GT-1234");
        mockMatch(match, "CookiesCapable", "True");
        mockMatch(match, "BrowserName", "Chrome");
        mockMatch(match, "BrowserVendor", "Google");
        mockMatch(match, "BrowserVersion", "42");
        mockMatch(match, "JavascriptVersion", "2.4.5");
        mockMatch(match, "CssVersion", "3.0");
        mockMatch(match, "IsMobile", "True");
        mockMatch(match, "IsCrawler", "True");
        mockMatch(match, "IsTablet", "True");
        mockMatch(match, "ScreenInchesDiagonal", "21");


        final Map<String, Object> expected =
                ImmutableMap.<String, Object>builder()
                        .put("os.vendor", "Microsoft")
                        .put("os.variant", "Microsoft Windows 8.1")
                        .put("os.model", "Windows")
                        .put("os.version", "8.1")

//                        .put("os.version.Name", "String")
//                        .put("os.version.MinorVersion", 100)
//                        .put("os.version.MinorVersionModifier", "String")
//                        .put("os.version.MinorVersionNamePart", "String")
//                        .put("os.version.MajorVersion", 100)
//                        .put("os.version.MajorVersionModifier", "String")
//                        .put("os.version.MajorVersionNamePart", "String")
//                        .put("os.version.MajorVersionNamePart.Number", 100)
//                        .put("os.version.MajorVersionNamePart.Modifier", "String")
//                        .put("os.version.MajorVersionNamePart.ModifierNumber", 100)
//                        .put("os.version.MajorVersionNamePart.ModifierPriority", 100)
//                        .put("os.version.IncrementalVersion", 100)
//                        .put("os.version.IncrementalVersionModifier", "String")
//                        .put("os.version.IncrementalVersionNamePart", "String")

//                        .put("userRequest.fullUrl", "String")
//                        .put("userServer.remoteUser", "String")
//                        .put("userServer.serverPort", "String")
//                        .put("userHttp.cacheControl", "String")

                        .put("ui.android", false)
                        .put("ui.largeBrowser", true)

                        .put("browser.displayHeight", 640) //from context
                        .put("browser.displayWidth", 1024) //from context
                        .put("browser.displayColorDepth", 32) //from context
//                        .put("browser.stylesheetSupport", hashset<string>)
//                        .put("browser.inputModeSupport", hashset<string>)
//                        .put("browser.scriptSupport", hashset<string>)
//                        .put("browser.inputDevices", hashset<string>)
//                        .put("browser.imageFormatSupport", hashset<string>)
//                        .put("browser.markupSupport", hashset<string>)
                        .put("browser.cookieSupport", true)
                        .put("browser.model", "Chrome")
                        .put("browser.modelAndOS", "Windows Chrome")
                        .put("browser.vendor", "Google")
                        .put("browser.variant", "Google Chrome 42")
                        .put("browser.version", "42")
                        .put("browser.jsVersion", "2.4.5")
//                        .put("browser.cssVersion", "3.0")
//                        .put("browser.preferredHtmlContentType", "xhtml")

                        .put("device.mobile", true)
                        .put("device.robot", true)
                        .put("device.tablet", true)
//                        .put("device.4g", true)
//                        .put("browser.inputDevices", hashset<string>)
                        .put("device.vendor", "LG")
                        .put("device.variant", "DeviceVariant")
                        .put("device.model", "GT-1234")
                        .put("device.version", "Nexus 5")
                        .put("device.displayHeight", 641)
                        .put("device.displayWidth", 1025)
                        .put("device.pixelDensity", 58) // sqrt(dh^2 + dw^2) / ScreenInchesDiagonal
                        .put("device.pixelRatio", 1.0)
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

        @Bean
        public HttpServletRequest httpServletRequest() {
            return new MockHttpServletRequest();
        }

        @Bean
        public ApplicationContextHolder applicationContextHolder() {
            return new ApplicationContextHolder();
        }

        @Bean
        public Extractors.Helper helper() {
            return new Extractors.Helper();
        }
    }

}