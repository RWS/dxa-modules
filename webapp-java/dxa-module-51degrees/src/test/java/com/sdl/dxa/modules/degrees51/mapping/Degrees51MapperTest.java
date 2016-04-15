package com.sdl.dxa.modules.degrees51.mapping;

import com.google.common.collect.ImmutableMap;
import org.junit.Test;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasEntry;

public class Degrees51MapperTest {

    @Test
    public void shouldMapKnownPropertiesFrom51DegreesToOurModel() {
        //given
        Map<String, List<String>> d51map = ImmutableMap.of(
                "PlatformVersion", Collections.singletonList("8.1"),
                "IsMobile", Collections.singletonList("True"),
                "BrowserVersion", Collections.singletonList("42"),
                "ScreenPixelsWidth", Collections.singletonList("1024"),
                "ScreenPixelsHeight", Collections.singletonList("640"));

        final Map<String, Object> expected =
                ImmutableMap.<String, Object>of(
                        "device.mobile", true,
                        "os.version", "8.1",
                        "browser.version", "42",
                        "browser.displayHeight", 640,
                        "browser.displayWidth", 1024);

        Degrees51Mapper mapper = new Degrees51Mapper();

        //when
        final Map<String, Object> result = mapper.map(d51map);

        //then
        for (Map.Entry<String, Object> entry : expected.entrySet()) {
            assertThat(result, hasEntry(entry.getKey(), entry.getValue()));
        }
    }

}