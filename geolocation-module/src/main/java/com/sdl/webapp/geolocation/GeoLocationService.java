package com.sdl.webapp.geolocation;

import com.tridion.ambientdata.AmbientDataContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.concurrent.ConcurrentHashMap;

/**
 * GeoLocation Service
 *
 * @author nic
 */

@Service
public class GeoLocationService {

    static private Log log = LogFactory.getLog(GeoLocationService.class);

    private boolean weatherEnabled = true;

    // TODO: Configure what to update: address, weather etc


    private ConcurrentHashMap<String, JSONObject> cachedLocations = new ConcurrentHashMap<>();
    private ConcurrentHashMap<String, GeoLocationData> cachedGeoData = new ConcurrentHashMap<>();

    public GeoLocationService() {

        log.info("Initializing GeoLocation service...");
    }

    public boolean isLocationKnown(HttpServletRequest request) {

        String remoteAddr = request.getRemoteAddr();
        return getCachedLocation(remoteAddr) != null;
    }

    public void cacheLocation(String remoteAddress, GeoLocationData geoData) {

        cachedGeoData.put(remoteAddress, geoData);
    }

    public GeoLocationData getCachedLocation(String remoteAddress) {
        return cachedGeoData.get(remoteAddress);
    }

    public GeoLocationData getLocationData(double latitude, double longitude) {

        String locationCacheKey = "" + latitude + "," + longitude;
        JSONObject location = cachedLocations.get(locationCacheKey);
        if ( location == null ) {
            location = this.getLocation(latitude, longitude);
            if ( location != null ) {
                cachedLocations.put(locationCacheKey, location);
            }

        }
        if ( location != null ) {

            GeoLocationData geoLocationData = new GeoLocationData();
            geoLocationData.setLatitude(latitude);
            geoLocationData.setLongitude(longitude);
            geoLocationData.setCountryName((String) location.get("country"));
            geoLocationData.setCountryCode((String) location.get("countrycode"));
            geoLocationData.setCity((String) location.get("city"));

            // TODO: Separate function for this!!

            if ( this.weatherEnabled ) {

                JSONObject weather = this.getWeather((String) location.get("woeid"));
                if ( weather != null ) {
                    JSONObject weatherCondition = weather.getJSONObject("item").getJSONObject("condition");
                    int conditionCode = weatherCondition.getInt("code");
                    String conditionText;
                    if ( conditionCode == WeatherConstants.NOT_AVAILABLE ) {
                        conditionText = "not available";
                    }
                    else {
                        conditionText = WeatherConstants.WEATHER_CONDITIONS[conditionCode];
                    }
                    geoLocationData.setWeatherCondition(conditionText);
                    geoLocationData.setTemperature(weatherCondition.getInt("temp"));
                }
                else {
                    log.warn("No current weather could be read for city: " + location.get("city"));
                }
            }
            return geoLocationData;
        }
        return null;
    }

    private JSONObject getLocation(double latitude, double longitude) {
        String query = "select * from geo.placefinder where text=\"" + latitude + "," + longitude + "\" and gflags=\"R\"";
        JSONObject queryResult = YQL.query(query);
        if ( queryResult != null ) {
            try {
                return queryResult.getJSONObject("Result");
            }
            catch ( Exception e ) {
                log.error("Could not get geo location. Skipping location for now.", e);
            }
        }
        return null;
    }

    private JSONObject getWeather(String woeid) {
        String query = "select * from weather.forecast where u=\"c\" and woeid = \"" + woeid + "\"";;
        JSONObject queryResult = YQL.query(query);
        if ( queryResult != null ) {
            try {
                return queryResult.getJSONObject("channel");
            }
            catch ( Exception e ) {
                log.error("Could not get weather data. Skipping this for now.", e);
            }
        }
        return null;
    }

}
