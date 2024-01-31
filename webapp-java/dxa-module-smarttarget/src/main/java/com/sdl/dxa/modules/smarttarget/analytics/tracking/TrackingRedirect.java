package com.sdl.dxa.modules.smarttarget.analytics.tracking;

import com.tridion.smarttarget.SmartTargetException;
import com.tridion.smarttarget.analytics.AnalyticsManager;
import com.tridion.smarttarget.analytics.tracking.TrackingUrlParameter;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

/**
 * Incorporated this class from the udp library in order to update it with the Jakarta Servlet API.
 * Imported legacy servlet.
 * This class is used to track and redirect the tracked conversion links.
 */
public class TrackingRedirect  extends HttpServlet {

    private static final Logger LOG = LoggerFactory.getLogger(TrackingRedirect.class);

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String redirectUrl = request.getParameter("url");
        String data = request.getParameter("data");

        if (StringUtils.isEmpty(redirectUrl)) {
            return;
        }
        if (StringUtils.isNotEmpty(data)) {
            try {
                AnalyticsManager analyticsManager = AnalyticsManager.getConfiguredAnalyticsManager();
                TrackingUrlParameter dataParameter = new TrackingUrlParameter(redirectUrl);
                if (dataParameter.deserialize(data)) {
                    Map<String, String> metaData = AnalyticsMetaData.fromRequest(request, request.getSession());
                    metaData.put("Document-Location", metaData.get("Document-Referrer"));
                    metaData.remove("Document-Referrer");
                    analyticsManager.trackConversion(dataParameter.getExperimentDimensions(), metaData);
                }
            }
            catch (SmartTargetException e) {
                LOG.error("Failed to track Experiment conversion.", e);
            }
        }

        try {
            response.sendRedirect(redirectUrl);
        }
        catch (IOException ex) {
            LOG.error(String.format("Failed to redirect to URL '%s'. Reason: %s", redirectUrl, ex.getMessage()));
        }
    }
}
