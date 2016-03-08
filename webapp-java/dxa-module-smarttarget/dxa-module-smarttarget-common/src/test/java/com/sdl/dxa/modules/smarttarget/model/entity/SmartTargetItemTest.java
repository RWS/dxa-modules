package com.sdl.dxa.modules.smarttarget.model.entity;

import com.sdl.webapp.common.api.content.ContentProvider;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.entity.Article;
import com.sdl.webapp.common.api.model.mvcdata.MvcDataImpl;
import com.sdl.webapp.common.exceptions.DxaException;
import com.sdl.webapp.common.util.ApplicationContextHolder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(loader = AnnotationConfigContextLoader.class)
@ActiveProfiles("test")
public class SmartTargetItemTest {

    @Autowired
    @Qualifier("1")
    private EntityModel expected;

    @Autowired
    private ContentProvider contentProvider;

    @Test
    public void shouldGetEntity() throws Exception {
        //given
        SmartTargetItem item = new SmartTargetItem("qwe1", null);

        //when
        EntityModel entity = item.getEntity();
        EntityModel entity2 = item.getEntity();

        //then
        assertEquals(expected, entity);
        assertEquals(expected, entity2);
        assertEquals(SmartTargetItem.class, entity.getMvcData().getMetadata().get("clazz"));
        assertEquals(SmartTargetItem.class, entity2.getMvcData().getMetadata().get("clazz"));

        verify(contentProvider, times(1)).getEntityModel(eq("qwe1"), any(Localization.class));
    }

    @Configuration
    @Profile("test")
    public static class ContextConfig {

        @Bean
        @Qualifier("1")
        public EntityModel entityModel1() {
            Article article = new Article();
            article.setId("qwe1");
            article.setMvcData(new MvcDataImpl.MvcDataImplBuilder().build());
            return article;
        }

        @Bean
        @Qualifier("2")
        public EntityModel entityModel2() {
            Article article = new Article();
            article.setId("qwe2");
            article.setMvcData(new MvcDataImpl.MvcDataImplBuilder().build());
            return article;
        }

        @Bean
        public ApplicationContextHolder applicationContextHolder() {
            return new ApplicationContextHolder();
        }

        @Bean
        public ContentProvider contentProvider() throws ContentProviderException, DxaException {
            ContentProvider contentProvider = mock(ContentProvider.class);
            when(contentProvider.getEntityModel(eq("qwe1"), any(Localization.class)))
                    .thenReturn(entityModel1());
            when(contentProvider.getEntityModel(eq("qwe2"), any(Localization.class)))
                    .thenReturn(entityModel1());
            return contentProvider;
        }
    }
}
