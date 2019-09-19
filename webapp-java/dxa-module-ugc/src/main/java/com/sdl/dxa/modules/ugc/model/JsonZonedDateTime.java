package com.sdl.dxa.modules.ugc.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.util.StdDateFormat;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.google.common.base.Objects;
import lombok.Data;
import org.joda.time.DateTime;

@Data
public class JsonZonedDateTime {
    private static ObjectMapper objectMapper = createObjectMapper();

    private DateTime dateTime;
    private String json;

    @Data
    private static class Holder {
        private int dayOfMonth;
        private int hour;
        private int minute;
        private String month = "";
        private int monthValue;
        private long nano = 0L;
        private int second;
        private int year;
        private String dayOfWeek = "";
        private int dayOfYear;
    }

    public JsonZonedDateTime(DateTime dateTime) throws JsonProcessingException {
        this.dateTime = dateTime;
        Holder holder = new Holder();
        holder.dayOfMonth = dateTime.getDayOfMonth();
        holder.hour = dateTime.getHourOfDay();
        holder.minute = dateTime.getMinuteOfHour();
        holder.monthValue = dateTime.getMonthOfYear();
        holder.second = dateTime.getSecondOfMinute();
        holder.year = dateTime.getYear();
        holder.dayOfYear = dateTime.getDayOfYear();
        json = objectMapper.writer().withRootName("").writeValueAsString(holder);
    }

    private static ObjectMapper createObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
        objectMapper.registerModule(new JodaModule());
        objectMapper.setDateFormat(new StdDateFormat());
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
//        objectMapper.setPropertyNamingStrategy(new PropertyNamingStrategy.UpperCamelCaseStrategy());
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_ABSENT);
        return objectMapper;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        JsonZonedDateTime that = (JsonZonedDateTime) o;
        return Objects.equal(dateTime, that.dateTime);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(dateTime);
    }

    public static ObjectMapper getObjectMapper() {
        return objectMapper;
    }
}