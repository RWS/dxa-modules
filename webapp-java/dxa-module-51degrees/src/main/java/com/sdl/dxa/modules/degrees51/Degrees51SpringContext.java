package com.sdl.dxa.modules.degrees51;

import com.sdl.dxa.modules.degrees51.api.mapping.Degrees51Mapping;
import com.sdl.dxa.modules.degrees51.api.mapping.Degrees51Processor;
import com.sdl.dxa.modules.degrees51.api.mapping.Extractor;
import com.sdl.webapp.common.util.InitializationUtils;
import fiftyone.mobile.detection.Match;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.Set;

import static com.google.common.collect.Sets.newHashSet;
import static com.sdl.dxa.modules.degrees51.api.mapping.Converters.TO_BOOLEAN;
import static com.sdl.dxa.modules.degrees51.api.mapping.Converters.TO_DOUBLE;
import static com.sdl.dxa.modules.degrees51.api.mapping.Converters.TO_STRING;
import static com.sdl.dxa.modules.degrees51.api.mapping.Degrees51Mapping.createMapping;
import static com.sdl.dxa.modules.degrees51.api.mapping.Degrees51Mapping.dummyMapping;
import static com.sdl.dxa.modules.degrees51.api.mapping.Extractors.CONCAT_GIVEN;
import static com.sdl.dxa.modules.degrees51.api.mapping.Extractors.FROM_CONTEXT_COOKIE_DOUBLE;
import static com.sdl.dxa.modules.degrees51.api.mapping.Extractors.FROM_CONTEXT_COOKIE_INTEGER;
import static com.sdl.dxa.modules.degrees51.api.mapping.Extractors.ifKeyThenSetOf;
import static com.sdl.dxa.modules.degrees51.api.mapping.Extractors.isStringEqualTo;
import static com.sdl.dxa.modules.degrees51.api.mapping.Extractors.justReturn;

@Configuration
@ComponentScan("com.sdl.dxa.modules.degrees51")
@Profile("51degrees.context.provider")
@EnableScheduling
public class Degrees51SpringContext {

    private static <T> void doMapping(final String dxaKey, final String degrees51Key, final Degrees51Processor<T> processor,
                                      ConfigurableListableBeanFactory beanFactory) {
        Degrees51Mapping<T> mapping = createMapping(dxaKey, degrees51Key, processor);
        beanFactory.registerSingleton(mapping.getKeyDxa(), mapping);
        InitializationUtils.traceBeanInitialization(mapping);
    }

    @Bean
    public BeanFactoryPostProcessor beanFactoryPostProcessor() {

        return new BeanFactoryPostProcessor() {
            @Override
            public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {

                doMapping("os.vendor", "PlatformVendor", TO_STRING, beanFactory);
                doMapping("os.variant", "os.vendor + ' ' + os.model + ' ' + os.version", CONCAT_GIVEN, beanFactory);
                doMapping("os.version", "PlatformVersion", TO_STRING, beanFactory);
                doMapping("os.model", "PlatformName", TO_STRING, beanFactory);

                doMapping("ui.android", "PlatformVendor", isStringEqualTo("android"), beanFactory);
                doMapping("ui.largeBrowser", "DeviceType", new Extractor<Boolean>() {
                    @Override
                    protected Boolean extract(Match match, Degrees51Mapping mapping) {
                        return !isStringEqualTo("SmallScreen").process(match, mapping);
                    }
                }, beanFactory);

                doMapping("device.mobile", "IsMobile", TO_BOOLEAN, beanFactory);
                doMapping("device.robot", "IsCrawler", TO_BOOLEAN, beanFactory);
                doMapping("device.tablet", "IsTablet", TO_BOOLEAN, beanFactory);
                doMapping("device.inputDevices", null, new Extractor<Set<String>>() {
                    private boolean is(String prop, Match match) {
                        Boolean is = dummyMapping(prop, TO_BOOLEAN).process(match);
                        return is != null && is;
                    }

                    @Override
                    protected Set<String> extract(Match match, Degrees51Mapping mapping) {
                        Set<String> result = newHashSet();
                        if ("desktop".equalsIgnoreCase(dummyMapping("DeviceType", TO_STRING).process(match))) {
                            result.add("keyboard");
                            result.add("mouse");
                        }
                        if (is("HasClickWheel", match)) {
                            result.add("clickwheel");
                        }
                        if (is("HasKeypad", match)) {
                            result.add("keypad");
                        }
                        if (is("HasTouchScreen", match)) {
                            result.add("touchscreen");
                        }
                        if (is("HasTrackpad", match)) {
                            result.add("trackpad");
                        }
                        return result;
                    }


                }, beanFactory);
                doMapping("device.displayWidth", "dw", FROM_CONTEXT_COOKIE_INTEGER, beanFactory);
                doMapping("device.displayHeight", "dh", FROM_CONTEXT_COOKIE_INTEGER, beanFactory);
                doMapping("device.pixelRatio", "dpr", FROM_CONTEXT_COOKIE_DOUBLE, beanFactory);
                doMapping("device.pixelDensity", "sqrt(dh^2 + dw^2) / ScreenInchesDiagonal", new Extractor<Integer>() {
                    @Override
                    protected Integer extract(Match match, Degrees51Mapping mapping) {
                        Degrees51Mapping<Double> dm = dummyMapping("ScreenInchesDiagonal", TO_DOUBLE);
                        Double d = dm.process(match);
                        if (d != null) {
                            Degrees51Mapping<Integer> hm = Degrees51Mapping.retrieveMappingByDxaKey("device.displayHeight");
                            Degrees51Mapping<Integer> wm = Degrees51Mapping.retrieveMappingByDxaKey("device.displayWidth");
                            if (hm != null && wm != null) {
                                Integer h = hm.process(match);
                                Integer w = wm.process(match);
                                return Double.valueOf(Math.round(Math.sqrt(h * h + w * w) / d)).intValue();
                            }
                        }
                        return null;
                    }
                }, beanFactory);
                doMapping("device.variant", "HardwareFamily", TO_STRING, beanFactory);
                doMapping("device.vendor", "HardwareVendor", TO_STRING, beanFactory);
                doMapping("device.version", "HardwareModel", TO_STRING, beanFactory);
                doMapping("device.model", "DeviceType", TO_STRING, beanFactory); // todo rly?

                doMapping("browser.version", "BrowserVersion", TO_STRING, beanFactory);
                doMapping("browser.variant", "browser.vendor + ' ' + browser.model + ' ' + browser.version", CONCAT_GIVEN, beanFactory);
                doMapping("browser.model", "BrowserName", TO_STRING, beanFactory);
                doMapping("browser.modelAndOS", "os.model + ' ' + browser.model", CONCAT_GIVEN, beanFactory);
                doMapping("browser.displayWidth", "bw", FROM_CONTEXT_COOKIE_INTEGER, beanFactory);
                doMapping("browser.displayHeight", "bh", FROM_CONTEXT_COOKIE_INTEGER, beanFactory);
                doMapping("browser.displayColorDepth", "bcd", FROM_CONTEXT_COOKIE_INTEGER, beanFactory);
                doMapping("browser.cookieSupport", "CookiesCapable", TO_BOOLEAN, beanFactory);
                doMapping("browser.vendor", "BrowserVendor", TO_STRING, beanFactory);
                doMapping("browser.markupSupport", "Html5", ifKeyThenSetOf("HTML5"), beanFactory);
                doMapping("browser.scriptSupport", "Javascript", ifKeyThenSetOf("JavaScript"), beanFactory);
                doMapping("browser.stylesheetSupport", "CssBackground | CssColor | CssColumn | CssFont | CssImages | " +
                        "CssText | CssTransitions", ifKeyThenSetOf(newHashSet("css10", "css21"), "css30"), beanFactory);
                doMapping("browser.inputModeSupport", null, justReturn(newHashSet("useInputmodeAttribute")), beanFactory);
                doMapping("browser.jsVersion", "JavascriptVersion", TO_STRING, beanFactory);
//                doMapping("browser.imageFormatSupport", null, justReturn(null), beanFactory); // todo
//                doMapping("browser.cssVersion", "HtmlVersion", justReturn(null), beanFactory); // todo
//                doMapping("browser.preferredHtmlContentType", null, justReturn(null), beanFactory); // todo
            }
        };
    }
}
