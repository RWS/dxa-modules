package com.sdl.webapp.smarttarget;

import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.entity.smarttarget.PromoBanner;
import com.tridion.ambientdata.AmbientDataContext;
import com.tridion.ambientdata.claimstore.ClaimStore;
import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.AnalyticsManager;
import com.tridion.smarttarget.analytics.results.AnalyticsResults;
import com.tridion.smarttarget.analytics.results.AnalyticsResultsRow;
import com.tridion.smarttarget.analytics.statistics.*;
import com.tridion.smarttarget.analytics.tracking.AnalyticsMetaData;
import com.tridion.smarttarget.analytics.tracking.ExperimentDimensions;
import com.tridion.smarttarget.experiments.statistics.Variant;
import com.tridion.smarttarget.experiments.statistics.Variants;
import com.tridion.smarttarget.query.*;
import com.tridion.smarttarget.tags.TimeoutQueryRunner;
import com.tridion.smarttarget.utils.AmbientDataHelper;
import com.tridion.smarttarget.utils.ConfigurationUtility;
import com.tridion.smarttarget.utils.CookieProcessor;
import com.tridion.smarttarget.utils.DateTimeConverters;
import com.tridion.util.TCMURI;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * SmartTarget Service
 *
 * @author nic
 */
@Service
//@Scope("request")
public class SmartTargetService {

    static private Log log = LogFactory.getLog(SmartTargetService.class);


    // TODO: Will this work really for default scope??
    @Autowired
    private HttpServletRequest httpRequest;

    @Autowired
    private WebRequestContext webRequestContext;


    private AnalyticsManager analyticsManager = null;

    private int queryTimeout = 10000; // TODO: Read from smarttarget_conf.xml

    private boolean experimentAutomaticSelectionEnabled = false;

    static DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");

    private boolean defaultAllowDuplicatesValue;

    public SmartTargetService() {
    }

    @PostConstruct
    public void initialize() {
        // TODO: Read from config
        this.experimentAutomaticSelectionEnabled =true;

        // TODO: Read expermient automatic selection from config??
        //ConfigurationUtility.getConfiguration("/Configuration/SmartTarget/");

        this.defaultAllowDuplicatesValue = ConfigurationUtility.getDefaultAllowDuplicates().booleanValue();

    }

    public SmartTargetQueryResult query(String pageId,
                                        SmartTargetRegionConfig regionConfig,
                                        List<String> componentTemplates) throws SmartTargetException {

        List<SmartTargetComponentPresentation> componentPresentations;

        // TODO: Add support for pagewide promotions so they are not duplicated

        String publicationId = this.getPublicationId(componentTemplates);
        // TODO: Is the creation of query instance costly?
        TimeoutQueryRunner queryRunner = new TimeoutQueryRunner(Integer.toString(this.queryTimeout));
        String queryString = this.buildQueryString(publicationId);
        log.debug("Query:" + queryString);
        String triggers = this.getTriggers(pageId, regionConfig.getRegionName(), publicationId);
        log.debug("Triggers: " + triggers);

        SmartTargetQueryResult queryResult = new SmartTargetQueryResult();
        ResultSet rs = queryRunner.executeQuery(queryString, null, triggers, publicationId);

        if ( rs != null ) {
            componentPresentations = this.processPromotions(rs.getPromotions(),
                                                            componentTemplates,
                                                            regionConfig.getMaxItems(),
                                                            publicationId,
                                                            regionConfig.getRegionName());

            if ( this.webRequestContext.isPreview() ) {
                filterPromotionList(rs.getPromotions(), componentPresentations);
                String xpmMarkup = ResultSetImpl.getExperienceManagerMarkup(regionConfig.getRegionName(), regionConfig.getMaxItems(), rs.getPromotions());
                queryResult.setXpmMarkup(xpmMarkup);
                log.debug("XPM Markup: " + xpmMarkup);
            }
        }
        else {
            componentPresentations = new ArrayList<>();
        }
        queryResult.setComponentPresentations(componentPresentations);

        return queryResult;
    }

    // TODO: Refactor so it can be used in a markup decorator
    public String postProcessExperimentComponentPresentation(String renderedComponentPresentation,
                                                             ExperimentDimensions experimentDimensions)
            throws SmartTargetException {

        return this.getAnalyticsManager().addTrackingToLinks(renderedComponentPresentation,
                                                             experimentDimensions, null);
    }

    protected String getPublicationId(List<String> componentTemplates) throws SmartTargetException
    {
        if ( componentTemplates == null || componentTemplates.size() == 0 )
        {
            throw new SmartTargetException("No expected component templates defined!");
        }
        try {
            TCMURI tcmUri = new TCMURI(componentTemplates.get(0));
            return "tcm:0-" + tcmUri.getPublicationId() + "-1";
        }
        catch ( ParseException e )
        {
            throw new SmartTargetException("Invalid Component Template TCM URI: " + componentTemplates.get(0));
        }

    }

    protected String getTriggers(String pageId, String regionName, String publicationId) {
        String triggers = null;
        ClaimStore claimStore = AmbientDataContext.getCurrentClaimStore();
        if ( claimStore != null ) {
            triggers = AmbientDataHelper.getTriggers(claimStore);
            triggers = triggers + "&st_publication=" + publicationId + "&st_region=" + regionName +
                       "&st_page=" + pageId;
            String userDate = dateFormat.format(new Date());
            triggers = triggers + "&st_active_period=" + userDate + "&fh_user_date=" + userDate;
        }

        return triggers;
    }

    protected String buildQueryString(String publicationId) {

        String universe = ConfigurationUtility.getDefaultUniverse();
        String locale = ConfigurationUtility.getDefaultLocale();

        StringBuilder sb = new StringBuilder();
        sb.append("fh_location=");
        sb.append("//");
        sb.append(universe);
        sb.append("/");
        sb.append(locale);
        sb.append("/categories<{");
        sb.append(universe);
        sb.append("_");
        sb.append(publicationId.replaceAll("-", "_").replaceAll(":", "_"));
        sb.append("}");
        return sb.toString();
    }

    private AnalyticsManager getAnalyticsManager() throws SmartTargetException {
        if ( this.analyticsManager == null ) {
            this.analyticsManager = AnalyticsManager.getConfiguredAnalyticsManager();
        }
        return this.analyticsManager;
    }

    private void filterPromotionList(List<Promotion> promotions, List<SmartTargetComponentPresentation> promotionCPs) throws SmartTargetException {
        for ( Promotion promotion : promotions ) {
            ArrayList<Item> excludedPromoItems = new ArrayList<>();
            for ( Item promoItem : promotion.getItems() ) {
                if ( isPromotionItemIncluded(promoItem.getComponentUriAsString(), promoItem.getTemplateUriAsString(), promotionCPs) ) {
                    promoItem.setVisible(true);
                }
                else {
                    excludedPromoItems.add(promoItem);
                }
            }
            for ( Item excludedItem : excludedPromoItems ) {
                promotion.getItems().remove(excludedItem);
            }
            if ( promotion.getItems().size() > 0 ) {
                promotion.setVisible(true);
            }
        }
    }

    private boolean isPromotionItemIncluded(String componentTcmUri, String templateTcmUri, List<SmartTargetComponentPresentation> promotionCPs) {

        for ( SmartTargetComponentPresentation promotionCP : promotionCPs ) {
            if ( promotionCP.getComponentUri().equals(componentTcmUri) && promotionCP.getTemplateUri().equals(templateTcmUri) ) {
                return true;
            }
        }
        return false;
    }

    private List<SmartTargetComponentPresentation> processPromotions(List<Promotion> promotions,
                                                                     List<String> componentTemplates,
                                                                     int maxItems,
                                                                     String publicationId,
                                                                     String regionName) throws SmartTargetException {

        List<SmartTargetComponentPresentation> componentPresentations = new ArrayList<>();
        Map<String, ExperimentCookie> existingExperimentCookies = CookieProcessor.getExperimentCookies(this.httpRequest);
        ExperimentDimensions experimentDimensions = new ExperimentDimensions();

        for (Promotion promotion : promotions) {

            if ( promotion instanceof Experiment )
            {
                Experiment experiment = (Experiment) promotion;
                ExperimentCookie newExperimentCookie = null;
                int variant = this.experimentAutomaticSelectionEnabled ? this.calculateWinner(experiment) : -1;
                if ( variant == -1 ) {
                    ExperimentCookie experimentCookie = existingExperimentCookies.get(experiment.getPromotionId());
                    if (experimentCookie == null) {
                        variant = experiment.chooseVariant();
                        if (variant < 0) {
                            break;
                        } else {
                            newExperimentCookie = new ExperimentCookie();
                            newExperimentCookie.setExperimentId(experiment.getPromotionId());
                            newExperimentCookie.setChosenVariant(variant);
                            Calendar calendar = Calendar.getInstance();
                            calendar.setTime(experiment.getEndDate());
                            calendar.add(6, 2);
                            newExperimentCookie.setExpirationDate(calendar.getTime());
                        }
                    } else {
                        variant = experimentCookie.getChosenVariant();
                    }
                }
                experimentDimensions.setExperimentId(experiment.getPromotionId());
                experimentDimensions.setPublicationTargetId(experiment.getPublicationTargetId());
                experimentDimensions.setChosenVariant(variant);

                int currentIndex = 0;
                for (Item item : promotion.getItems() ) {
                    if ( currentIndex++ == variant && componentTemplates.contains(item.getTemplateUriAsString()) ) {
                        experimentDimensions.setComponentId(item.getComponentUriAsString());
                        experimentDimensions.setComponentTemplateId(item.getTemplateUriAsString());
                        experimentDimensions.setPublicationId(publicationId);
                        experimentDimensions.setPageId((String) httpRequest.getAttribute("pageId"));
                        experimentDimensions.setRegion(regionName);
                        this.getAnalyticsManager().trackView(experimentDimensions,
                                AnalyticsMetaData.fromRequest(this.httpRequest,
                                        this.httpRequest.getSession()));
                        SmartTargetComponentPresentation cp =
                                new SmartTargetComponentPresentation(item.getComponentUriAsString(),
                                                                     item.getTemplateUriAsString(),
                                                                     promotion.getPromotionId(),
                                                                     regionName);
                        cp.setExperiment(true);
                        cp.setExperimentDimensions(experimentDimensions);
                        if ( newExperimentCookie != null ) {
                            cp.setAdditionalMarkup(this.getExperimentCookieMarkup(newExperimentCookie));
                        }
                        componentPresentations.add(cp);

                    }
                    else if ( componentTemplates.contains(item.getTemplateUriAsString()) ) {
                        SmartTargetComponentPresentation cp =
                                new SmartTargetComponentPresentation(item.getComponentUriAsString(),
                                                                     item.getTemplateUriAsString(),
                                                                     promotion.getPromotionId(),
                                                                     regionName);
                        cp.setExperiment(true);
                        cp.setVisible(false);
                        cp.setExperimentDimensions(experimentDimensions);
                        componentPresentations.add(cp);
                    }
                }
            }
            else {

                for (Item item : promotion.getItems()) {
                    if ( componentTemplates.contains(item.getTemplateUriAsString()) ) {
                        SmartTargetComponentPresentation cp =
                                new SmartTargetComponentPresentation(item.getComponentUriAsString(),
                                                                     item.getTemplateUriAsString(),
                                                                     promotion.getPromotionId(),
                                                                     regionName);
                        componentPresentations.add(cp);
                    }
                }
            }

            if ( componentPresentations.size() >= maxItems ) {  break; }

        }

        return componentPresentations;

    }

    private String getExperimentCookieMarkup(ExperimentCookie experimentCookie) {
        StringBuilder markup = new StringBuilder();
        markup.append("\n<script type='text/javascript'>\n");
        String expirationDateString = DateTimeConverters.convertToCookieExpirationFormat(experimentCookie.getExpirationDate());
        markup.append(String.format("document.cookie = \"%s=%d; expires=%s; path=/;\";\n", new Object[] { new StringBuilder().append("st_exp_").append(experimentCookie.getExperimentId()).toString(), Integer.valueOf(experimentCookie.getChosenVariant()), expirationDateString }));
        markup.append("</script>\n");
        return markup.toString();
    }


    private int calculateWinner(Experiment experiment) throws SmartTargetException {

        StatisticsExperimentDimensions statisticalDimensions = new StatisticsExperimentDimensions();
        statisticalDimensions.setPerChosenVariant(true);
        statisticalDimensions.setPerPublicationId(true);

        StatisticsFilters filters = new StatisticsFilters();
        SimpleStatisticsFilter filter = new SimpleStatisticsFilter();
        filter.setName("ExperimentId");
        filter.setOperator(StatisticsFilterOperator.Equals);
        filter.setOperand(experiment.getPromotionId());
        filters.add(filter);
        filter = new SimpleStatisticsFilter();
        filter.setName("PublicationTargetId");
        filter.setOperator(StatisticsFilterOperator.Equals);
        filter.setOperand(experiment.getPublicationTargetId());
        filters.add(filter);

        AnalyticsManager analyticsManager = this.getAnalyticsManager();
        AnalyticsResults results = analyticsManager.getStatistics(
                                       experiment.getStartDate(),
                                       experiment.getEndDate(),
                                       statisticalDimensions,
                                       new StatisticsTimeDimensions(),
                                       new ArrayList<String>(),
                                       filters);

        Variants variants = new Variants();
        for ( AnalyticsResultsRow row : results.getRows() ) {
            Variant variant = new Variant();
            variant.setIndex(Integer.parseInt(row.getExperimentDimensions().getChosenVariant()));
            variant.setViews(row.getVariantViews());
            variant.setConversions(row.getVariantConversions());
            variants.add(variant);
        }

        analyticsManager.calculateWinner(variants);

        for ( Variant variant : variants ) {
            if ( variant.isWinner() ) {
                System.out.println("The winner is: " + variant.getIndex());
                return variant.getIndex();
            }
        }

        return -1;
    }

    static class SimpleStatisticsFilter extends StatisticsFilter {

    }

}
