package com.sdl.webapp.geolocation;

/**
 * GeoLocationData
 *
 * @author nic
 */
public class GeoLocationData {

    private double latitude;
    private double longitude;
    private String countryName;
    private String countryCode;
    private String city;
    private String weatherCondition;
    private int temperature;

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getCountryName() {
        return countryName;
    }

    void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public String getCountryCode() {
        return countryCode;
    }

    void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getCity() {
        return city;
    }

    void setCity(String city) {
        this.city = city;
    }

    public String getWeatherCondition() {
        return weatherCondition;
    }

    void setWeatherCondition(String weatherCondition) {
        this.weatherCondition = weatherCondition;
    }

    public int getTemperature() {
        return temperature;
    }

    void setTemperature(int temperature) {
        this.temperature = temperature;
    }

    @Override
    public String toString() {
        return "GeoLocationData{" +
                "countryName='" + countryName + '\'' +
                ", countryCode='" + countryCode + '\'' +
                ", city='" + city + '\'' +
                ", weatherCondition='" + weatherCondition + '\'' +
                ", temperature=" + temperature +
                '}';
    }
}
