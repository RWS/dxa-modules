package com.sdl.dxa.modules.degrees51.api.mapping;

import com.sdl.webapp.common.util.ApplicationContextHolder;
import fiftyone.mobile.detection.Match;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.io.IOException;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(loader = AnnotationConfigContextLoader.class)
@ActiveProfiles("test")
public class ExtractorsTest {

    @Test
    public void shouldConcatenateUsingDelimiters() {
        //given
        Degrees51Mapping mapping = new Degrees51Mapping() {
            @Override
            public String getKey() {
                return "os.model + ' ' + browser.model + '_' + browser.type + browser.version";
            }

            @Override
            public String getKeyDxa() {
                return "test.property";
            }

            @Override
            public Degrees51Processor<?> getProcessor() {
                return Extractors.CONCAT_GIVEN;
            }
        };

        //when
        String result = (String) mapping.getProcessor().process(mock(Match.class), mapping);

        //then
        assertEquals("Windows Chrome_Desktop49", result);
    }


    @Configuration
    @Profile("test")
    public static class SpringConfigurationContext {

        private static <T> Degrees51Processor<T> mockProcessor(final T result) {
            return new Degrees51Processor<T>() {
                @Override
                protected T processInternal(Match match, Degrees51Mapping mapping) throws IOException {
                    return result;
                }
            };
        }

        private static <T> void doMapping(final String dxaKey, final String degrees51Key,
                                          final Degrees51Processor<T> processor,
                                          ConfigurableListableBeanFactory beanFactory) {
            Degrees51Mapping<T> mapping = new Degrees51Mapping<T>() {
                @Override
                public String getKey() {
                    return degrees51Key;
                }

                @Override
                public String getKeyDxa() {
                    return dxaKey;
                }

                @Override
                public Degrees51Processor<T> getProcessor() {
                    return processor;
                }
            };

            beanFactory.registerSingleton(mapping.getKeyDxa(), mapping);
        }

        @Bean
        public ApplicationContextHolder applicationContextHolder() {
            return new ApplicationContextHolder();
        }

        @Bean
        public BeanFactoryPostProcessor beanFactoryPostProcessor() {
            return new BeanFactoryPostProcessor() {
                @Override
                public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
                    doMapping("os.model", "", mockProcessor("Windows"), beanFactory);
                    doMapping("browser.model", "", mockProcessor("Chrome"), beanFactory);
                    doMapping("browser.type", "", mockProcessor("Desktop"), beanFactory);
                    doMapping("browser.version", "", mockProcessor(49), beanFactory);
                }
            };
        }
    }


}