package com.sdl.dxa.modules.degrees51.mapping;

import com.google.common.collect.ImmutableMap;
import fiftyone.mobile.detection.Match;
import fiftyone.mobile.detection.entities.Values;
import org.junit.Test;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasEntry;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class Degrees51MapperTest {

    @Test
    public void shouldMapKnownPropertiesFrom51DegreesToOurModel() throws IOException {
        //given
        Match match = mock(Match.class);
        mockMatch(match, "PlatformVersion", "8.1");
        mockMatch(match, "IsMobile", "True");
        mockMatch(match, "BrowserVersion", "42");
        mockMatch(match, "ScreenPixelsWidth", "1024");
        mockMatch(match, "ScreenPixelsHeight", "640");

        final Map<String, Object> expected =
                ImmutableMap.<String, Object>of(
                        "device.mobile", true,
                        "os.version", "8.1",
                        "browser.version", "42",
                        "browser.displayHeight", 640,
                        "browser.displayWidth", 1024);

        Degrees51Mapper mapper = new Degrees51Mapper();

        //when
        final Map<String, Object> result = mapper.map(match);

        //then
        for (Map.Entry<String, Object> entry : expected.entrySet()) {
            assertThat(result, hasEntry(entry.getKey(), entry.getValue()));
        }
    }

    private <T> void mockMatch(Match match, String propertyName, T value) throws IOException {
        String string = Objects.toString(value);

        Values values = mock(Values.class);
        when(match.getValues(eq(propertyName))).thenReturn(values);
        when(values.toString()).thenReturn(string);
        try {
            double aDouble = Double.parseDouble(string);
            when(values.toDouble()).thenReturn(aDouble);
        } catch (NumberFormatException ignored) {
        }
        when(values.toBool()).thenReturn(Boolean.parseBoolean(string));
    }

}