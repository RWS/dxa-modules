package com.sdl.dxa.modules.smarttarget.analytics.tracking;

import org.apache.commons.lang3.StringUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Incorporated this class from the udp library in order to update it with the Jakarta Servlet API.
 * Represents metadata to add to the tracking requests.
 */
public class AnalyticsMetaData {

    /**
     * Returns the metadata based on the request and session.
     * @param request The current request
     * @param session The current session
     * @return A Map containing the metadata values.
     */
    public static Map<String, String> fromRequest(HttpServletRequest request, HttpSession session) {
        HashMap<String, String> metaData = new HashMap<>();
        metaData.put("Document-Location", request.getRequestURL().toString());
        metaData.put("Document-Referrer", request.getHeader("Referer"));
        metaData.put("Remote-Address", request.getRemoteAddr());
        metaData.put("User-Agent", request.getHeader("User-Agent"));
        metaData.put("User-Language", request.getHeader("Accept-Language"));

        String clientId = UUID.randomUUID().toString();
        if (session != null) {
            final String sessionKey = "Experiment-Client-ID";
            clientId = (String) session.getAttribute(sessionKey);
            if (StringUtils.isEmpty(clientId)) {
                clientId = UUID.randomUUID().toString();
                request.getSession().setAttribute(sessionKey, clientId);
            }
        }

        metaData.put("Client-ID", clientId);
        return metaData;
    }
}
