package com.sdl.dxa.modules.smarttarget.utils;

import com.tridion.smarttarget.query.ExperimentCookie;
import com.tridion.ambientdata.AmbientDataContext;
import com.tridion.ambientdata.claimstore.ClaimStore;
import com.tridion.ambientdata.web.WebContext;
import com.tridion.smarttarget.utils.DateTimeConverters;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.jsp.JspWriter;
import java.io.IOException;
import java.net.URI;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

/**
 * Incorporated this class from the udp library in order to update it with the Jakarta Servlet API.
 * Exposes functionality to read and write cookies.
 */
public class CookieProcessor {

    private CookieProcessor() {
        // This is a utility class with only static members and should therefore not have a public constructor.
    }

    private static final Logger LOG = LoggerFactory.getLogger(CookieProcessor.class);

    private static final String COOKIE_NAME = "st_exp_";
    private static final String SET_COOKIE_HEADER_NAME = "Set-Cookie";
    private static final String SET_COOKIE_FORMAT = "%s%s=%s; Expires=%s; path=/; HttpOnly";

    private static final int YEAR_2100 = 2100;

    /**
     * Gets a Map of cookies indicating which variant has been shown for what Experiment to a visitor.
     *
     * @param request the ServletRequest to read the cookies.
     * @return a Map where the key refers the the Experiment Id and the value is a
     * {@link ExperimentCookie} holding information about what chosen variant was shown.
     */
    public static Map<String, ExperimentCookie> getExperimentCookies(ServletRequest request) {
        Map<String, ExperimentCookie> result = new HashMap<>();

        Cookie[] cookies = ((HttpServletRequest) request).getCookies();

        if (cookies == null || cookies.length == 0) {
            return new HashMap<>();
        }

        for (Cookie cookie : cookies) {
            if (!cookie.getName().startsWith(COOKIE_NAME)) {
                continue;
            }

            ExperimentCookie experimentCookie = new ExperimentCookie();
            experimentCookie.setExperimentId(cookie.getName().substring(COOKIE_NAME.length()));
            experimentCookie.setChosenVariant(Integer.parseInt(cookie.getValue()));

            int secondsFromExpirationDate = cookie.getMaxAge();
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.SECOND, secondsFromExpirationDate);

            experimentCookie.setExpirationDate(calendar.getTime());


            result.put(experimentCookie.getExperimentId(), experimentCookie);
        }
        return result;
    }

    /**
     * Creates Experiment Cookies from Cookies exposed through the ClaimStore (to support cookies in REL).
     *
     * @return A Map representing all the Experiment Cookies.
     */
    public static Map<String, ExperimentCookie> getExperimentCookiesFromAmbientDataFramework() {
        Map<String, ExperimentCookie> result = new HashMap<>();

        ClaimStore claimStore = WebContext.getCurrentClaimStore();
        if (claimStore == null) {
            claimStore = AmbientDataContext.getCurrentClaimStore();
        }

        if (claimStore == null) {
            LOG.info("No ClaimStore available");
            return result;
        }

        if (!claimStore.contains(URI.create("taf:request:cookies"))) {
            LOG.info("No request cookies encountered.");
            return result;
        }

        Map<String, String> cookies = (Map<String, String>) claimStore.get(URI.create("taf:request:cookies"));
        for (Map.Entry<String, String> entry : cookies.entrySet()) {
            if (!entry.getKey().startsWith(COOKIE_NAME)) {
                continue;
            }

            ExperimentCookie experimentCookie = new ExperimentCookie();
            experimentCookie.setExperimentId(entry.getKey().substring(COOKIE_NAME.length()));
            experimentCookie.setChosenVariant(Integer.parseInt(entry.getValue()));

            //Dummy date, as the Cookies exposed in the ClaimStore don't actually contain the Expiration date.
            Calendar calendar = Calendar.getInstance();
            calendar.set(YEAR_2100, 1, 1);
            experimentCookie.setExpirationDate(calendar.getTime());

            result.put(experimentCookie.getExperimentId(), experimentCookie);
        }
        return result;
    }

    /**
     * Adds Experiment cookies to the ServletResponse.
     *
     * @param response          the ServletResponse to add the cookies to.
     * @param writer            the JspWriter used to write out JavaScript code to set the cookies in case
     *                          the response output was already committed.
     * @param experimentCookies * @return a Map where the key refers the the Experiment Id and the value is a
     *                          {@link ExperimentCookie} holding information about what chosen variant was shown.
     */
    public static void saveExperimentCookies(ServletResponse response,
                                             JspWriter writer, Map<String, ExperimentCookie> experimentCookies) {
        if (experimentCookies == null || experimentCookies.size() < 1) {
            return;
        }

        HttpServletResponse output = (HttpServletResponse) response;

        if (output.isCommitted()) {
            try {
                writer.append(getFallbackForExperimentCookies(experimentCookies));
            } catch (IOException e) {
                LOG.error("Failed to write the JavaScript version of the cookies too.", e);
            }
            return;
        }

        for (ExperimentCookie experimentCookie : experimentCookies.values()) {
            String setCookieHeaderValue = createSetCookieHeaderValue(experimentCookie);
            output.addHeader(SET_COOKIE_HEADER_NAME, setCookieHeaderValue);
            LOG.debug("Added response header for cookie: {}", experimentCookie);
        }
    }

    private static String createSetCookieHeaderValue(ExperimentCookie experimentCookie) {
        String expirationDateString = DateTimeConverters.
                convertToCookieExpirationFormat(experimentCookie.getExpirationDate());
        return String.format(SET_COOKIE_FORMAT, COOKIE_NAME, experimentCookie.getExperimentId(),
                experimentCookie.getChosenVariant(), expirationDateString);
    }

    /**
     * Builds JavaScript code to set the cookies in case the ServletResponse output was already committed.
     *
     * @param experimentCookies the Map of cookies to set.
     * @return the JavaScript code setting the cookies.
     */
    public static String getFallbackForExperimentCookies(Map<String, ExperimentCookie> experimentCookies) {
        if (experimentCookies == null || experimentCookies.size() < 1) {
            return "";
        }

        LOG.warn("Unable to set Http-Only cookies for Experiments, as the headers have already been output for this " +
                "request (e.g. the response buffer has been flushed). Attempting to use JavaScript instead.");

        StringBuilder result = new StringBuilder();
        result.append("\n<script type='text/javascript'>\n");

        for (ExperimentCookie experimentCookie : experimentCookies.values()) {
            String expirationDateString = DateTimeConverters.
                    convertToCookieExpirationFormat(experimentCookie.getExpirationDate());
            result.append(
                    String.format("document.cookie = \"%s=%d; expires=%s; path=/;\";%n",
                            COOKIE_NAME + experimentCookie.getExperimentId(),
                            experimentCookie.getChosenVariant(),
                            expirationDateString
                    )
            );
        }

        result.append("</script>\n");
        return result.toString();

    }
}
