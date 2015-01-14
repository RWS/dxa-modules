package com.sdl.webapp.smarttarget.analytics;

import com.tridion.smarttarget.analytics.AnalyticsConfiguration;
import com.tridion.smarttarget.analytics.ChiSquareAlgorithm;
import com.tridion.smarttarget.experiments.statistics.Variant;

import java.lang.reflect.Field;

/**
 * ConfigurableChiSquareAlgorithm
 *
 * @author nic
 */
public class ConfigurableChiSquareAlgorithm extends ChiSquareAlgorithm implements ExperimentWinnerAlgorithm {

    ConfigurableChiSquareAlgorithm(AnalyticsConfiguration configuration) {
        super();

        try {
            Field field = ChiSquareAlgorithm.class.getDeclaredField("MINIMUM_CONVERSIONS_PER_VARIANT");
            field.setAccessible(true);
            int minConversionsPerVariant = Integer.parseInt(configuration.getAnalyticsProperty("MinimumConversionsPerVariant", "100"));
            field.setInt(this, minConversionsPerVariant);
        }
        catch ( Exception e ) {
            System.err.println("Could not modify minimum conversion per variant: " + e);
        }

    }

    @Override
    protected boolean hasEnoughConversions() {
        for (Variant variant : this.variants) {
            if (variant.getConversions() < this.MINIMUM_CONVERSIONS_PER_VARIANT) {
                return false;
            }
        }

        return true;
    }


}