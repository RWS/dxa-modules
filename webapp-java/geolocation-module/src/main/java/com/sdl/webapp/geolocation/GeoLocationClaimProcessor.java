package com.sdl.webapp.geolocation;

import com.sdl.webapp.adfdelegate.ModuleClaimProcessorRegistry;
import com.tridion.ambientdata.AmbientDataException;
import com.tridion.ambientdata.claimstore.ClaimStore;
import com.tridion.ambientdata.processing.AbstractClaimProcessor;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.net.URI;
import java.util.Map;

/**
 * GeoCoordsFootprintProcessor
 *
 * @author nic
 */
@Component
public class GeoLocationClaimProcessor extends AbstractClaimProcessor {

    static private Log log = LogFactory.getLog(GeoLocationClaimProcessor.class);

    // Store geo data in memory for a source IP

    // Used when using XPM Footprints
    static final URI GEO_COORDS_URI = URI.create("taf:claim:geolocation:coords");

    static final URI LONGITUDE_URI = URI.create("taf:claim:geolocation:longitude");
    static final URI LATITUDE_URI = URI.create("taf:claim:geolocation:latitude");
    static final URI COUNTRY_NAME_URI = URI.create("taf:claim:geolocation:countryname");
    static final URI COUNTRY_CODE_URI = URI.create("taf:claim:geolocation:countrycode");
    static final URI CITY_URI = URI.create("taf:claim:geolocation:city");

    static final URI WEATHER_CONDITION_URI = URI.create("taf:claim:geolocation:weather");
    static final URI TEMPERATURE_URI = URI.create("taf:claim:geolocation:weather:temperature");
    static final URI COOKIES_URI = URI.create("taf:request:cookies");
    static final URI SERVER_VARIABLES_URI = URI.create("taf:server:variables");

    static final String LATITUDE_COOKIE_NAME = "lat";
    static final String LONGITUDE_COOKIE_NAME = "lon";

    @Autowired
    private GeoLocationService geoLocationService;

    @Autowired
    private ModuleClaimProcessorRegistry moduleClaimProcessorRegistry;

    @Value("${geolocation.cacheLocationBasedOnIP}")
    private boolean cacheLocationBasedOnIP = false;

    @PostConstruct
    public void initialize() {
        this.moduleClaimProcessorRegistry.registerModuleClaimProcessor(this);
    }

    @PreDestroy
    public void teardown() {
        this.moduleClaimProcessorRegistry.unregisterModuleClaimProcessor(this);
    }

    @Override
    public void onRequestStart(ClaimStore claimStore) throws AmbientDataException {

        String countryName = (String) claimStore.get(COUNTRY_NAME_URI);
        if ( countryName == null ) {

            Map<String,String> serverVariables = (Map<String,String>) claimStore.get(SERVER_VARIABLES_URI);
            Map<String,String> cookies = (Map<String,String>) claimStore.get(COOKIES_URI);
            String remoteAddress = serverVariables.get("REMOTE_ADDR");

            GeoLocationData geoData = null;

            if ( this.cacheLocationBasedOnIP ) {
                geoData = this.geoLocationService.getCachedLocation(remoteAddress);
            }
            if ( geoData == null ) {

                if (!cookies.containsKey(LATITUDE_COOKIE_NAME) || !cookies.containsKey(LONGITUDE_COOKIE_NAME)) {
                    log.warn("Geo location cookies is missing. Skip setting geo location claims.");
                    return;
                }
                double latitude = Double.parseDouble(cookies.get(LATITUDE_COOKIE_NAME));
                double longitude = Double.parseDouble(cookies.get(LONGITUDE_COOKIE_NAME));
                try {
                    geoData = this.geoLocationService.getLocationData(latitude, longitude);
                }
                catch ( Exception e ) {
                    log.warn("Could not get geo position. Ignoring geo data in claim store.");
                    return;
                }
                if ( this.cacheLocationBasedOnIP ) {
                    this.geoLocationService.cacheLocation(remoteAddress, geoData);
                }
            }

            if ( geoData != null ) {
                claimStore.put(LATITUDE_URI, geoData.getLatitude());
                claimStore.put(LONGITUDE_URI, geoData.getLongitude());
                claimStore.put(COUNTRY_NAME_URI, geoData.getCountryName());
                claimStore.put(COUNTRY_CODE_URI, geoData.getCountryCode());
                claimStore.put(CITY_URI, geoData.getCity());
                claimStore.put(WEATHER_CONDITION_URI, geoData.getWeatherCondition());
                claimStore.put(TEMPERATURE_URI, geoData.getTemperature());
            }
        }
    }

    @Override
    public void onRequestEnd(ClaimStore claimStore) throws AmbientDataException {}

    @Override
    public void onSessionStart(ClaimStore claimStore) throws AmbientDataException {}
}
