package com.sdl.webapp.common.impl.mapping;

import com.sdl.dxa.modules.core.model.entity.Article;
import com.sdl.webapp.common.api.mapping.semantic.SemanticMappingRegistry;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.entity.MediaItem;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SCHEMA_ORG;
import static org.junit.Assert.assertFalse;

/**
 * Checks if all models are registered even if they are in a package other than default.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(loader = AnnotationConfigContextLoader.class)
@ActiveProfiles("test")
public class SemanticMappingRegistryImplBunchRegistrationTest {

    @Autowired
    private SemanticMappingRegistry semanticMappingRegistry;


    @Test
    public void shouldRegisterAllModels() {
        //then
        assertFalse(semanticMappingRegistry.getEntityInfo(MediaItem.class).isEmpty());
        assertFalse(semanticMappingRegistry.getEntityInfo(Article.class).isEmpty());
        assertFalse(semanticMappingRegistry.getEntityInfo(TestEntity.class).isEmpty());
    }


    @Configuration
    @Profile("test")
    public static class TestContext {

        @Bean
        public SemanticMappingRegistry semanticMappingRegistry() {
            return new SemanticMappingRegistryImpl();
        }
    }

    @SemanticEntity(entityName = "TestEntity", vocabulary = SCHEMA_ORG, prefix = "s", public_ = true)
    public static class TestEntity extends AbstractEntityModel {

    }
}
