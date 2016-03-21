package com.sdl.dxa.modules.smarttarget.model.entity;

import com.tridion.smarttarget.analytics.tracking.ExperimentDimensions;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * XO Experiment.
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class SmartTargetExperiment extends SmartTargetPromotion {
    private final ExperimentDimensions experimentDimensions;
}
