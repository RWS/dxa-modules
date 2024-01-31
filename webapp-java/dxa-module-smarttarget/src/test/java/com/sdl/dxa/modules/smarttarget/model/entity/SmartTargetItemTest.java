package com.sdl.dxa.modules.smarttarget.model.entity;

import com.sdl.webapp.common.api.content.ContentProvider;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.mvcdata.MvcDataImpl;
import com.sdl.webapp.common.exceptions.DxaException;
import com.sdl.webapp.common.util.ApplicationContextHolder;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = SmartTargetItemTest.ContextConfig.class)
//@ActiveProfiles("test")
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

        verify(contentProvider, times(1)).getEntityModel(eq("qwe1"),
                nullable(Localization.class));
    }

    @Configuration
    //@Profile("test")
    public static class ContextConfig {

        @Bean
        @Qualifier("1")
        public EntityModel entityModel1() {
            TestEntity testEntity = new TestEntity();
            testEntity.setId("qwe1");
            testEntity.setMvcData(new MvcDataImpl.MvcDataImplBuilder().build());
            return testEntity;
        }

        @Bean
        @Qualifier("2")
        public EntityModel entityModel2() {
            TestEntity testEntity = new TestEntity();
            testEntity.setId("qwe2");
            testEntity.setMvcData(new MvcDataImpl.MvcDataImplBuilder().build());
            return testEntity;
        }

        @Bean
        public ApplicationContextHolder applicationContextHolder() {
            return new ApplicationContextHolder();
        }

        @Bean
        public ContentProvider contentProvider() throws DxaException {
            ContentProvider contentProvider = mock(ContentProvider.class);
            lenient().when(contentProvider.getEntityModel(eq("qwe1"), nullable(Localization.class)))
                    .thenReturn(entityModel1());
            lenient().when(contentProvider.getEntityModel(eq("qwe2"), nullable(Localization.class)))
                    .thenReturn(entityModel1());
            return contentProvider;
        }

        private static class TestEntity extends AbstractEntityModel {

        }
    }
}
