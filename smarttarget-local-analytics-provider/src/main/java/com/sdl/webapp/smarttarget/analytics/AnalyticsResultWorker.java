package com.sdl.webapp.smarttarget.analytics;

import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.AnalyticsConfiguration;
import com.tridion.smarttarget.experiments.statistics.Variant;
import com.tridion.smarttarget.experiments.statistics.Variants;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * AnalyticsResultWorker
 *
 * @author nic
 */
public class AnalyticsResultWorker implements Runnable {

    static private Log log = LogFactory.getLog(AnalyticsResultWorker.class);

    private BlockingQueue<AnalyticsTask>  queue = new LinkedBlockingQueue<>();
    private List<AggregatedTracking> pendingTrackings = new ArrayList<>();
    private Thread workerThread;
    private LocalAnalyticsManager analyticsManager;
    private AnalyticsResultRepository repository;
    private ScheduleTask scheduleTask;

    static final long DEFAULT_STORE_TRACKINGS_INTERVAL = 60000L; // Default 60 seconds


    /**
     * Different analytics tasks
     */

    static abstract class AnalyticsTask {}

    static class AggregateTrackingTask extends AnalyticsTask {
        TrackedExperiment trackedExperiment;

        AggregateTrackingTask(TrackedExperiment trackedExperiment) {
            this.trackedExperiment = trackedExperiment;
        }
    }

    static class StoreTrackingTask extends AnalyticsTask {}

    static class CalculateWinnerTask extends AnalyticsTask {

        String experimentId;
        int publicationId;
        int publicationTargetId;

        CalculateWinnerTask(String experimentId, int publicationId, int publicationTargetId) {
            this.experimentId = experimentId;
            this.publicationId = publicationId;
            this.publicationTargetId = publicationTargetId;
        }
    }


    /**
     * Scheduler that regular checks if there is any pending results to be persistent
     */
    class ScheduleTask extends TimerTask {

        Timer timer;

        ScheduleTask(long interval) {
            timer = new Timer();
            timer.scheduleAtFixedRate(this, interval, interval);
        }

        @Override
        public void run() {
            if ( pendingTrackings.size() > 0 ) {
                queue.add(new StoreTrackingTask());
            }
        }
    }

    public AnalyticsResultWorker(LocalAnalyticsManager analyticsManager, AnalyticsResultRepository repository, AnalyticsConfiguration configuration) {

        long storeResultsInterval = DEFAULT_STORE_TRACKINGS_INTERVAL;

        if ( configuration != null ) {
            String storeIntervalConfig = configuration.getAnalyticsProperty("TrackingStoreInterval");
            if ( storeIntervalConfig != null ) {
                storeResultsInterval = Long.parseLong(storeIntervalConfig);
            }
        }

        this.analyticsManager = analyticsManager;
        this.repository = repository;
        this.workerThread = new Thread(this);
        this.workerThread.setDaemon(true);
        this.workerThread.start();
        this.scheduleTask = new ScheduleTask(storeResultsInterval);
    }


    public void submitTracking(TrackedExperiment trackedExperiment) {
        this.queue.add(new AggregateTrackingTask(trackedExperiment));
    }

    /**
     * Worker loop
     */
    @Override
    public void run() {

        while ( true ) {
            try {
                AnalyticsTask task = this.queue.take();
                if ( task instanceof AggregateTrackingTask ) {
                    this.aggregateTracking((AggregateTrackingTask) task);
                }
                else if ( task instanceof StoreTrackingTask ) {
                    this.storePendingTrackings();
                }
                else if ( task instanceof CalculateWinnerTask ) {
                    this.calculateWinner((CalculateWinnerTask) task);
                }
                else {
                    log.error("Invalid task received: " + task);
                }


            }
            catch ( InterruptedException e ) {
                continue;
            }
            catch ( Exception e  ) {
               log.error("Exception in worker thread.", e);
            }
        }
    }

    private void aggregateTracking(AggregateTrackingTask task) {

        boolean foundTracking = false;
        for ( AggregatedTracking aggregatedTracking : this.pendingTrackings ) {
            if ( aggregatedTracking.canAggregate(task.trackedExperiment)  ) {
                aggregatedTracking.increaseCount();
                foundTracking = true;
                break;
            }
        }
        if ( !foundTracking ) {
            AggregatedTracking aggregatedTracking = new AggregatedTracking(task.trackedExperiment);
            aggregatedTracking.increaseCount();
            this.pendingTrackings.add(aggregatedTracking);
        }
    }

    private void storePendingTrackings() {

        log.debug("Storing pending trackings: #" + this.pendingTrackings.size());
        for ( AggregatedTracking tracking : this.pendingTrackings ) {
            this.repository.storeTrackingResult(tracking);
        }
        this.pendingTrackings.clear();
    }

    // TODO: REMOVE!!!!
    private void calculateWinner(CalculateWinnerTask task) {

        // TODO: How can we utilize the winner result from the SmartTarget service without doing any hacks????

        List<AggregatedTracking> trackings = this.repository.getTrackingResults(task.experimentId, task.publicationId, task.publicationTargetId);
        Variants variants = new Variants();
        for ( AggregatedTracking tracking : trackings ) {
            Variant currentVariant = null;
            for ( Variant variant : variants ) {
                if ( variant.getIndex() == tracking.getChosenVariant() ) {
                    currentVariant = variant;
                    break;
                }
            }
            if ( currentVariant == null ) {
                currentVariant = new Variant();
                currentVariant.setIndex(tracking.getChosenVariant());
                variants.add(currentVariant);
            }
            if ( tracking.getType() == ExperimentType.VIEW ) {
                currentVariant.setViews(currentVariant.getViews() + tracking.getCount());
            }
            else {
                currentVariant.setConversions(currentVariant.getConversions() + tracking.getCount());
            }

        }

        try {

            this.analyticsManager.calculateWinner(variants);
            for ( Variant variant : variants ) {
                if ( variant.isWinner() ) {
                    log.debug("The winner is: " + variant.getIndex());
                    this.repository.setExperimentWinner(task.experimentId, task.publicationId, task.publicationTargetId, variant.getIndex());
                }
            }
        }
        catch ( SmartTargetException e ) {
            log.error("Error while calculating winner.", e);
        }




    }
}
