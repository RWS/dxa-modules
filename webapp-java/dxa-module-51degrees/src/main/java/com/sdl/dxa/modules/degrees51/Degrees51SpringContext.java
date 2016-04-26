package com.sdl.dxa.modules.degrees51;

import com.sdl.dxa.modules.degrees51.api.mapping.Degrees51Mapping;
import com.sdl.dxa.modules.degrees51.api.mapping.Degrees51Processor;
import com.sdl.webapp.common.util.InitializationUtils;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

import static com.sdl.dxa.modules.degrees51.api.mapping.Converters.TO_BOOLEAN;
import static com.sdl.dxa.modules.degrees51.api.mapping.Converters.TO_STRING;
import static com.sdl.dxa.modules.degrees51.api.mapping.Extractors.FROM_CONTEXT_COOKIE;

@Configuration
@ComponentScan("com.sdl.dxa.modules.degrees51")
@EnableScheduling
public class Degrees51SpringContext {

    private static void doMapping(final String dxaKey, final String degrees51Key, final Degrees51Processor<?> processor,
                                  ConfigurableListableBeanFactory beanFactory) {
        Degrees51Mapping mapping = new Degrees51Mapping() {
            @Override
            public String getKey() {
                return degrees51Key;
            }

            @Override
            public String getKeyDxa() {
                return dxaKey;
            }

            @Override
            public Degrees51Processor<?> getProcessor() {
                return processor;
            }
        };

        beanFactory.registerSingleton(mapping.getKeyDxa(), mapping);
        InitializationUtils.traceBeanInitialization(mapping);
    }

    @Bean
    public BeanFactoryPostProcessor beanFactoryPostProcessor() {
        return new BeanFactoryPostProcessor() {
            @Override
            public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
                doMapping("os.version", "PlatformVersion", TO_STRING, beanFactory);
                doMapping("os.model", "PlatformName", TO_STRING, beanFactory);

                doMapping("device.mobile", "IsMobile", TO_BOOLEAN, beanFactory);
                doMapping("device.robot", "IsCrawler", TO_BOOLEAN, beanFactory);
                doMapping("device.tablet", "IsTablet", TO_BOOLEAN, beanFactory);
                doMapping("device.displayWidth", "dw", FROM_CONTEXT_COOKIE, beanFactory);
                doMapping("device.displayHeight", "dh", FROM_CONTEXT_COOKIE, beanFactory);
                doMapping("device.variant", "DeviceType", TO_STRING, beanFactory);
                doMapping("device.model", "DeviceType", TO_BOOLEAN, beanFactory);

                doMapping("browser.version", "BrowserVersion", TO_STRING, beanFactory);
                doMapping("browser.displayWidth", "bw", FROM_CONTEXT_COOKIE, beanFactory);
                doMapping("browser.displayHeight", "bh", FROM_CONTEXT_COOKIE, beanFactory);
                doMapping("browser.displayColorDepth", "bcd", FROM_CONTEXT_COOKIE, beanFactory);
                doMapping("browser.cookieSupport", "CookiesCapable", TO_BOOLEAN, beanFactory);
                doMapping("browser.vendor", "BrowserVendor", TO_STRING, beanFactory);
                doMapping("browser.jsVersion", "JavascriptVersion", TO_STRING, beanFactory);
//              doMapping("browser.browser.cssVersion", "JavascriptVersion", TO_STRING, beanFactory);
            }
        };
    }
}
