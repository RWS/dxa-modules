package com.sdl.webapp.smarttarget.analytics;

import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.AnalyticsConfiguration;
import com.tridion.smarttarget.analytics.AnalyticsManager;
import com.tridion.smarttarget.analytics.CustomDimensionNames;
import com.tridion.smarttarget.analytics.results.AnalyticsResults;
import com.tridion.smarttarget.analytics.results.AnalyticsResultsRow;
import com.tridion.smarttarget.analytics.statistics.StatisticsExperimentDimensions;
import com.tridion.smarttarget.analytics.statistics.StatisticsFilter;
import com.tridion.smarttarget.analytics.statistics.StatisticsFilters;
import com.tridion.smarttarget.analytics.statistics.StatisticsTimeDimensions;
import com.tridion.smarttarget.analytics.tracking.ExperimentDimensions;
import com.tridion.smarttarget.experiments.statistics.Variants;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.*;

/**
 * Local Analytics Manager
 *
 * @author nic
 */
public class LocalAnalyticsManager extends AnalyticsManager {

    // TODO: Aggregate the data here so it will not take that much space, basically just a view/conversion counter
    // TODO: Make a async DB writer (using HSQL)

    static private Log log = LogFactory.getLog(LocalAnalyticsManager.class);

    private static ArrayList<TrackedExperiment> views = new ArrayList<>();
    private static ArrayList<TrackedExperiment> conversions = new ArrayList<>();
    private Class<?> experimentWinnerAlgorithm;


    static class TrackedExperiment {
        Date date;
        ExperimentDimensions experimentDimensions;

        TrackedExperiment(ExperimentDimensions experimentDimensions) {
            this.experimentDimensions = experimentDimensions;
            this.date = new Date();
        }
    }

    enum ExperimentType {
        VIEW,
        CONVERSION
    }

    public LocalAnalyticsManager() throws SmartTargetException {
        String algorithmClassName = this.getConfiguration().getAnalyticsProperty("ExperimentWinnerAlgorithmClassName");

        try {
            this.experimentWinnerAlgorithm = Class.forName(algorithmClassName);
        }
        catch ( ClassNotFoundException e ) {
            throw new SmartTargetException("Could not load experiment winner algorithm with class name: " + algorithmClassName, e);
        }
    }

    @Override
    public CustomDimensionNames getCustomDimensions() {
        return new SimpleCustomDimensionNames();
    }

    @Override
    public StatisticsFilter getStatisticsFilter() {
        return new SimpleStatisticsFilter();
    }

    @Override
    public void trackView(ExperimentDimensions experimentDimensions, Map<String, String> metadata) {

        // TODO: Store per experiment ID here???
        System.out.println("Track view: " + experimentDimensions);

        /*
        if ( views.size() == 0 ) {
            // Create a dummy null reference
            //                                                                              ‘


        }
        */

        views.add(new TrackedExperiment(experimentDimensions));
    }

    @Override
    public void trackConversion(ExperimentDimensions experimentDimensions, Map<String, String> metadata) {
        System.out.println("Track conversion: " + experimentDimensions);
        conversions.add(new TrackedExperiment(experimentDimensions));
    }

    @Override
    protected AnalyticsResults getStatisticsResults(Date startDate,
                                                    Date endDate,
                                                    StatisticsExperimentDimensions experimentDimensions,
                                                    StatisticsTimeDimensions timeDimensions,
                                                    List<String> extraDimensions,
                                                    StatisticsFilters statisticsFilters,
                                                    int startIndex,
                                                    int maxResults) throws Exception {

        log.debug("Getting analytics results...");
        log.debug("Statistics Filters: " + statisticsFilters);
        log.debug("Dimensions: " + experimentDimensions);
        log.debug("Time Dimensions: " + timeDimensions);


        SimpleAnalyticsResults results = new SimpleAnalyticsResults();



        for ( TrackedExperiment trackedExperiment : views ) {
            this.addAnalyticsResultsRow(results, trackedExperiment, experimentDimensions, timeDimensions, ExperimentType.VIEW);
        }
        for ( TrackedExperiment trackedExperiment : conversions ) {
            this.addAnalyticsResultsRow(results, trackedExperiment, experimentDimensions, timeDimensions, ExperimentType.CONVERSION);
        }

        log.debug("Returning result: " + results);

        return results;
    }

    private void addAnalyticsResultsRow(AnalyticsResults results,
                                        TrackedExperiment trackedExperiment,
                                        StatisticsExperimentDimensions experimentDimensions,
                                        StatisticsTimeDimensions timeDimensions,
                                        ExperimentType type)
            throws SmartTargetException
    {

        // TODO: Do filter on experiment ID here!!!
        // Filter contains ExperimentId, PublicationTargetId & PublicationId

        AnalyticsResultsRow row = new AnalyticsResultsRow();

        ExperimentDimensions dimensions = trackedExperiment.experimentDimensions;
        if (experimentDimensions.isPerExperimentId()) row.getExperimentDimensions().setExperimentId(dimensions.getExperimentId());
        if (experimentDimensions.isPerPublicationTargetId()) row.getExperimentDimensions().setPublicationTargetId(dimensions.getPublicationTargetId());
        if (experimentDimensions.isPerPublicationId()) row.getExperimentDimensions().setPublicationId(dimensions.getPublicationId());
        if (experimentDimensions.isPerPageId()) row.getExperimentDimensions().setPageId(dimensions.getPageId());
        if (experimentDimensions.isPerRegion()) row.getExperimentDimensions().setRegion(dimensions.getRegion());
        if (experimentDimensions.isPerComponentId()) row.getExperimentDimensions().setComponentId(dimensions.getComponentId());
        if (experimentDimensions.isPerComponentTemplateId()) row.getExperimentDimensions().setComponentTemplateId(dimensions.getComponentTemplateId());
        if (experimentDimensions.isPerChosenVariant()) row.getExperimentDimensions().setChosenVariant(Integer.toString(dimensions.getChosenVariant()));
        if (!row.getExperimentDimensions().isValid()) return;


        Calendar cal = Calendar.getInstance();
        cal.setTime(trackedExperiment.date);

        if (timeDimensions.isPerYear()) row.getTimeDimensions().setYear(cal.get(Calendar.YEAR));
        if (timeDimensions.isPerMonth()) row.getTimeDimensions().setMonth(cal.get(Calendar.MONTH));
        if (timeDimensions.isPerWeek()) row.getTimeDimensions().setWeek(cal.get(Calendar.WEEK_OF_YEAR));
        if (timeDimensions.isPerHour()) row.getTimeDimensions().setHour(cal.get(Calendar.HOUR));
        if (timeDimensions.isPerDay()) {
            Calendar dayCal = Calendar.getInstance();
            dayCal.clear();
            dayCal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH));
            row.getTimeDimensions().setDay(dayCal.getTime());
        }
        AnalyticsResultsRow existingRow = results.getExistingRowWithSameDimensions(row);
        if (existingRow != null) {
            System.out.println("Using an existing row...");
            row = existingRow;
        }
        else {
            System.out.println("Creating a new row...");
            results.getRows().add(row);
        }

        if ( type == ExperimentType.CONVERSION ) {
            row.setVariantConversions(row.getVariantConversions()+1);
            System.out.println("Conversion count: " + row.getVariantConversions());
        }
        else {
            row.setVariantViews(row.getVariantViews()+1);
            System.out.println("Views count: " + row.getVariantViews());
        }
    }

    @Override
    public void calculateWinner(Variants variants) throws SmartTargetException {

        try {
            ExperimentWinnerAlgorithm algorithm = (ExperimentWinnerAlgorithm)
                    this.experimentWinnerAlgorithm.getConstructor(AnalyticsConfiguration.class).
                            newInstance(this.getConfiguration());
            algorithm.process(variants);
        }
        catch ( SmartTargetException e ) {
            throw e;
        }
        catch ( Exception e ) {
            throw new SmartTargetException("Error while calculating winner", e);
        }
    }
}
