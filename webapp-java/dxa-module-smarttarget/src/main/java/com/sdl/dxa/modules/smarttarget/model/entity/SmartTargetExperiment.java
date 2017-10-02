package com.sdl.dxa.modules.smarttarget.model.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.sdl.dxa.caching.NeverCached;
import com.sdl.webapp.common.util.ApplicationContextHolder;
import com.tridion.smarttarget.analytics.tracking.ExperimentDimensions;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.IOException;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@NeverCached(qualifier = "SmartTargetExperiment")
public class SmartTargetExperiment extends SmartTargetPromotion {

    @JsonProperty("ExperimentDimensions")
    @JsonSerialize(using = ExperimentDimensionsSerializer.class)
    private ExperimentDimensions experimentDimensions;

    private static class ExperimentDimensionsSerializer extends JsonSerializer<ExperimentDimensions> {
        @Override
        public void serialize(ExperimentDimensions value, JsonGenerator jgen, SerializerProvider provider)
                throws IOException {
            ApplicationContextHolder.getContext().getBean(ObjectMapper.class).writeValue(jgen, value);
        }
    }
}
