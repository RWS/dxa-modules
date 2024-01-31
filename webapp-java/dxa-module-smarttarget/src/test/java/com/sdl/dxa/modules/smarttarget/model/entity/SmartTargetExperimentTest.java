package com.sdl.dxa.modules.smarttarget.model.entity;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdl.dxa.DxaSpringInitialization;
import com.sdl.dxa.modules.smarttarget.markup.TrackingMarkupDecorator;
import com.sdl.webapp.common.util.ApplicationContextHolder;
import com.tridion.smarttarget.analytics.tracking.ExperimentDimensions;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = SmartTargetExperimentTest.SpringConfigurationContext.class)
@ActiveProfiles("test")
public class SmartTargetExperimentTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void shouldSerializeExperimentDimensionsWithUpperCamelCase() throws IOException {
        //given
        ExperimentDimensions dimensions = getExperimentDimensions();
        SmartTargetExperiment smartTargetExperiment = new SmartTargetExperiment(dimensions);

        //when
        String result = objectMapper.writeValueAsString(smartTargetExperiment);

        //then
        assertTrue(EqualsBuilder.reflectionEquals(getExpected().getExperimentDimensions(),
                objectMapper.readValue(result, SmartTargetExperiment.class).getExperimentDimensions()));
    }

    private ExperimentDimensions getExperimentDimensions() {
        ExperimentDimensions dimensions = new ExperimentDimensions();
        dimensions.setChosenVariant(1);
        dimensions.setComponentTemplateId("tcm:1065-9195-32");
        dimensions.setComponentId("tcm:1065-9826-16");
        dimensions.setRegion("Example1");
        dimensions.setPageId("tcm:1065-9824-64");
        dimensions.setPublicationId("tcm:0-1065-1");
        dimensions.setInstanceId("CdEnvironment1");
        dimensions.setExperimentId("232fc389-88be-4a3c-bad0-ef1313120b5e");
        return dimensions;
    }

    public SmartTargetExperiment getExpected() throws IOException {
        return objectMapper.readValue("{\n" +
                "    \"ExperimentDimensions\": {\n" +
                "        \"ExperimentId\": \"232fc389-88be-4a3c-bad0-ef1313120b5e\",\n" +
                "        \"InstanceId\": \"CdEnvironment1\",\n" +
                "        \"PublicationId\": \"tcm:0-1065-1\",\n" +
                "        \"PageId\": \"tcm:1065-9824-64\",\n" +
                "        \"Region\": \"Example1\",\n" +
                "        \"ComponentId\": \"tcm:1065-9826-16\",\n" +
                "        \"ComponentTemplateId\": \"tcm:1065-9195-32\",\n" +
                "        \"ChosenVariant\": 1\n" +
                "    }\n" +
                "}", SmartTargetExperiment.class);
    }

    @Configuration
    @Profile("test")
    public static class SpringConfigurationContext {
        @Bean
        public ObjectMapper objectMapper() {
            return new DxaSpringInitialization().objectMapper();
        }

        @Bean
        public ApplicationContextHolder applicationContextHolder() {
            return new ApplicationContextHolder();
        }

        @Bean
        public TrackingMarkupDecorator trackingMarkupDecorator() {
            return null;
        }
    }
}