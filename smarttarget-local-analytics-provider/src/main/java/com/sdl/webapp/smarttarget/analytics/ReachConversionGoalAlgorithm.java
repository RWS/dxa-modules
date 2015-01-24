package com.sdl.webapp.smarttarget.analytics;

import com.tridion.smarttarget.analytics.AnalyticsConfiguration;
import com.tridion.smarttarget.experiments.statistics.Variant;
import com.tridion.smarttarget.experiments.statistics.Variants;

/**
 * ReachConversionGoalAlgorithm
 *
 * @author nic
 */
public class ReachConversionGoalAlgorithm implements ExperimentWinnerAlgorithm {

    private int goal;

    public ReachConversionGoalAlgorithm(AnalyticsConfiguration configuration) {

        // TODO: Use reach a certain % level instead????
        this.goal = Integer.parseInt(configuration.getAnalyticsProperty("ConversionGoal", "1000"));
    }

    @Override
    public void process(Variants variants) {

        for ( Variant variant : variants ) {
            if ( variant.getConversions() >= this.goal ) {
                variant.setWinner(true);
                break;
            }
        }
    }
}
