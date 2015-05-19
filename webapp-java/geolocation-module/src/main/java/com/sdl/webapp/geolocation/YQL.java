package com.sdl.webapp.geolocation;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URLEncoder;

/**
 * YQL
 *
 * @author nic
 */
public abstract class YQL {

    static private Log log = LogFactory.getLog(YQL.class);

    static final String YQL_BASE_URL = "http://query.yahooapis.com/v1/public/yql?q=";

    // TODO: Rewrite using Jersey REST instead

    public static JSONObject query(String query) {

        try {
            String yqlQuery = YQL_BASE_URL + URLEncoder.encode(query, "UTF-8") + "&format=json";

            GetMethod method = new GetMethod(yqlQuery);

            HttpClient httpClient = new HttpClient();
            int statusCode = httpClient.executeMethod(method);

            if (statusCode != HttpStatus.SC_OK) {
                log.error("Failed to execute YQL query. HTTP status code: " + statusCode);
                return null;
            }
            InputStream rstream = method.getResponseBodyAsStream();

            // Process the response from Yahoo! Web Services
            BufferedReader br = new BufferedReader(new InputStreamReader(rstream));
            String jsonString = "";
            String line;
            while ((line = br.readLine()) != null) {
                jsonString += line;
            }
            br.close();

            JSONObject jo = new JSONObject(jsonString);
            JSONObject resultObject = jo.getJSONObject("query").getJSONObject("results");
            return resultObject;

        } catch (Exception e) {

            log.error("Failed to execute YQL query.", e);
            return null;
        }

    }
}
