package com.sdl.webapp.smarttarget.analytics;

import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.AnalyticsConfiguration;
import com.tridion.smarttarget.analytics.statistics.StatisticsFilter;
import com.tridion.smarttarget.analytics.statistics.StatisticsFilters;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.datasource.SimpleDriverDataSource;
import org.springframework.util.ClassUtils;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;
import java.util.Date;

/**
 * AnalyticsResultRepository
 *
 * @author nic
 */
public class AnalyticsResultRepository {

    // TODO: Have it configurable so tracking is disabled as soon a winner has been selected
    // -> In this case use the winner table for this.

    static private Log log = LogFactory.getLog(AnalyticsResultRepository.class);

    private JdbcTemplate jdbcTemplate;

    private boolean cacheEnabled = false;
    private int resultCacheTime = 60000; // default cache tracking results in 60 seconds (if enabled)
    private Map<String, AnalyticsResultCacheItem> trackingResultCache;

    static final String INSERT_TRACKING_RESULT_SQL =
            "INSERT INTO TRACKING_RESULT " +
                    "(EXP_ID, PUBLICATION_ID, PUB_TARGET_ID, COMPONENT_ID, COMPONENT_TEMPLATE_ID, PAGE_ID, REGION, TRACKING_DATE, CHOSEN_VARIANT, TRACKING_TYPE, TRACKING_COUNT) " +
                    "VALUES (?,?,?,?,?,?,?,?,?,?,?)";
    static final String QUERY_TRACKING_RESULTS_WITH_FILTER_SQL = "SELECT * FROM TRACKING_RESULT ";
    static final String QUERY_TRACKING_RESULTS = "SELECT * FROM TRACKING_RESULT WHERE EXP_ID=? AND PUBLICATION_ID=? AND PUBLICATION_TARGET_ID=?";

    static final String INSERT_EXPERIMENT_WINNER_SQL = "INSERT INTO EXPERIMENT_WINNER (EXP_ID, PUBLICATION_ID, PUB_TARGET_ID, WINNER_VARIANT, WINNER_SELECTION_DATE) VALUES(?,?,?);";
    static final String GET_EXPERIMENT_WINNER_SQL    = "SELECT WINNER_VARIANT FROM EXPERIMENT_WINNER WHERE EXP_ID = ? AND PUBLICATION_ID=? AND PUB_TARGET_ID=?";

    static class AnalyticsResultRowMapper implements RowMapper<AggregatedTracking> {

        @Override
        public AggregatedTracking mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new AggregatedTracking(
                    rs.getString("EXP_ID"),
                    rs.getInt("PUBLICATION_ID"),
                    rs.getInt("PUB_TARGET_ID"),
                    rs.getInt("COMPONENT_ID"),
                    rs.getInt("COMPONENT_TEMPLATE_ID"),
                    rs.getInt("PAGE_ID"),
                    rs.getString("REGION"),
                    rs.getInt("CHOSEN_VARIANT"),
                    ExperimentType.fromInt(rs.getInt("TRACKING_TYPE")),
                    rs.getDate("TRACKING_DATE"),
                    rs.getInt("TRACKING_COUNT"));
        }
    }

    class AnalyticsResultCacheItem {
        List<AggregatedTracking> trackingResults;
        long cacheTimestamp;

        AnalyticsResultCacheItem(List<AggregatedTracking> trackingResults) {
            this.cacheTimestamp = System.currentTimeMillis();
        }

        boolean hasExpired() {
            return System.currentTimeMillis() > this.cacheTimestamp + resultCacheTime;
        }
    }

    public AnalyticsResultRepository(AnalyticsConfiguration configuration) throws SmartTargetException {
        this (  configuration.getAnalyticsProperty("Storage/@url"),
                configuration.getAnalyticsProperty("Storage/@className") );

        String cacheTimeConfig = configuration.getAnalyticsProperty("Storage/@cacheTime");
        if ( cacheTimeConfig != null ) {
            this.cacheEnabled = true;
            this.resultCacheTime = Integer.parseInt(cacheTimeConfig);
            this.trackingResultCache = new WeakHashMap<>();
        }
    }

    public AnalyticsResultRepository(String jdbcUrl, String jdbcDriverClassName) throws SmartTargetException {

        // TODO: Replace this with proper JNDI based data sources
        //
        try {
            Driver jdbcDriver = (Driver) ClassUtils.forName(jdbcDriverClassName, ClassUtils.getDefaultClassLoader()).newInstance();
            DataSource ds = new SimpleDriverDataSource(jdbcDriver, jdbcUrl);
            this.jdbcTemplate = new JdbcTemplate(ds);
        }
        catch ( Exception e ) {
            throw new SmartTargetException("Could not create database connection for the analytics results.", e);
        }
    }


    // TODO: REMOVE !!!!!!
    public void setExperimentWinner(String experimentId, int publicationId, int publicationTargetId, int winnerVariant) {
        this.jdbcTemplate.update(INSERT_EXPERIMENT_WINNER_SQL, experimentId, publicationId, publicationTargetId, winnerVariant, new Date());
    }

    // TODO: REMOVE !!!!
    public int getExperimentWinner(String experimentId, int publicationId, int publicationTargetId) {
        List<Integer> winnerVariant = this.jdbcTemplate.queryForList(GET_EXPERIMENT_WINNER_SQL, Integer.class,
                                        experimentId, publicationId, publicationTargetId);
        if ( winnerVariant.size() == 0 ) { return -1; }
        return winnerVariant.get(0);
    }

    public void storeTrackingResult(AggregatedTracking trackingResult) {
        this.jdbcTemplate.update(INSERT_TRACKING_RESULT_SQL,
                trackingResult.getExperimentId(),
                trackingResult.getPublicationId(),
                trackingResult.getPublicationTargetId(),
                trackingResult.getComponentId(),
                trackingResult.getComponentTemplateId(),
                trackingResult.getPageId(),
                trackingResult.getRegion(),
                trackingResult.getDate(),
                trackingResult.getChosenVariant(),
                trackingResult.getType().toInt(),
                trackingResult.getCount());
    }


    public List<AggregatedTracking> getTrackingResults(String experimentId, int publicationId, int publicationTargetId) {
        return this.jdbcTemplate.query(QUERY_TRACKING_RESULTS,  new AnalyticsResultRowMapper(),
                                        experimentId, publicationId, publicationTargetId);
    }

    public List<AggregatedTracking> getTrackingResults(StatisticsFilters filters) {

        if ( cacheEnabled ) {
            AnalyticsResultCacheItem cacheItem = this.trackingResultCache.get(this.getCacheKey(filters));
            if ( cacheItem != null ) {
                if ( cacheItem.hasExpired() ) {
                    this.trackingResultCache.remove(filters);
                }
                else {
                    return cacheItem.trackingResults;
                }
            }
        }

        StringBuilder query = new StringBuilder();
        query.append(QUERY_TRACKING_RESULTS_WITH_FILTER_SQL);
        Object[] queryParams = this.buildQuery(filters, query);
        List<AggregatedTracking> results = this.jdbcTemplate.query(query.toString(), queryParams, new AnalyticsResultRowMapper());

        if ( cacheEnabled ) {
            this.trackingResultCache.put(this.getCacheKey(filters), new AnalyticsResultCacheItem(results));
        }
        return results;
    }

    private String getCacheKey(StatisticsFilters filters) {
        StringBuilder sb = new StringBuilder();
        for ( StatisticsFilter filter : filters ) {
            sb.append(filter.getName());
            sb.append(filter.getOperator());
            sb.append(filter.getOperand());
            sb.append(":");
        }
        return sb.toString();
    }

    private Object[] buildQuery(StatisticsFilters filters, StringBuilder query) {
        List<Object> values = new ArrayList<>();
        boolean firstValue = true;
        for ( StatisticsFilter filter : filters ) {
            if ( firstValue ) {
                query.append("WHERE ");
                firstValue = false;
            }
            else {
                query.append("AND");
            }

            if ( filter.getName().equals("ExperimentId") ) {
                query.append(" EXP_ID = ? ");
                values.add(filter.getOperand());
            }
            else if ( filter.getName().equals("PublicationId") ) {
                query.append(" PUBLICATION_ID = ? ");
                values.add(TcmUtils.extractItemIdFromTcmUri(filter.getOperand()));
            }
            else if ( filter.getName().equals("PublicationTargetId") ) {
                query.append(" PUB_TARGET_ID = ? ");
                values.add(TcmUtils.extractItemIdFromTcmUri(filter.getOperand()));
            }
            else {
                log.error("Invalid filter parameter: " + filter.getName());
            }
        }
        return values.toArray();
    }

}
