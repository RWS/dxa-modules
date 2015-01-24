package com.sdl.webapp.smarttarget.analytics;

import com.tridion.smarttarget.analytics.statistics.StatisticsFilters;
import com.tridion.smarttarget.analytics.tracking.ExperimentDimensions;
import org.junit.Test;

import java.util.List;

/**
 * TestResultRepository
 *
 * @author nic
 */
public class TestResultRepository {

    static final String REPOSITORY_JDBC_URL = "jdbc:hsqldb:/Users/nic/Develop/Projects/SDL/TRI/db/trackingdb;user=sa;password=";
    static final String REPOSITORY_DRIVER_CLASSNAME = "org.hsqldb.jdbcDriver";

    @Test
    public void testWriteToDB() throws Exception {

        AnalyticsResultRepository repository = new AnalyticsResultRepository(REPOSITORY_JDBC_URL, REPOSITORY_DRIVER_CLASSNAME);

        ExperimentDimensions dimensions = new ExperimentDimensions();
        dimensions.setExperimentId("TEST-EXP1");
        dimensions.setPublicationId("tcm:0-45-1");
        dimensions.setPublicationTargetId("tcm:0-45-65537");
        dimensions.setComponentId("tcm:45-1234");
        dimensions.setComponentTemplateId("tcm:45-4568-32");
        dimensions.setPageId("tcm:45-3002-64");
        dimensions.setRegion("Main");
        dimensions.setChosenVariant(1);

        TrackedExperiment trackedExperiment = new TrackedExperiment(dimensions, ExperimentType.VIEW);
        AggregatedTracking aggregatedTracking = new AggregatedTracking(trackedExperiment);
        aggregatedTracking.increaseCount();

        repository.storeTrackingResult(aggregatedTracking);

        List<AggregatedTracking> results = repository.getTrackingResults(new StatisticsFilters());
        for ( AggregatedTracking result: results ) {
            System.out.println("Tracking Experiment: " + result);
        }
    }

    @Test
    public void testWriteThroughWorker() throws Exception {

        AnalyticsResultRepository repository = new AnalyticsResultRepository(REPOSITORY_JDBC_URL, REPOSITORY_DRIVER_CLASSNAME);
        AnalyticsResultWorker worker = new AnalyticsResultWorker(null, repository, null);

        ExperimentDimensions dimensions = new ExperimentDimensions();
        dimensions.setExperimentId("TEST-EXP1");
        dimensions.setPublicationId("tcm:1-45-0");
        dimensions.setPublicationTargetId("tcm:0-45-65537");
        dimensions.setChosenVariant(1);

        TrackedExperiment trackedExperiment = new TrackedExperiment(dimensions, ExperimentType.VIEW);
        worker.submitTracking(trackedExperiment);

        Thread.sleep(100000);
    }

}
