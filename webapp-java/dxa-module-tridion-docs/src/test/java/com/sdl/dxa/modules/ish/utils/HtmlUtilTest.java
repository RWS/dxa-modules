package com.sdl.dxa.modules.ish.utils;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * HtmlUtil test class.
 */
public class HtmlUtilTest {
    private static final String SOURCE =
            "<h1>TopicTitle</h1>" +
                    "<div class=\"body\">" +
                    "    <img src=\"/binary/1420746/345963/user-guide/330-picture\" />" +
                    "    <a href=\"/1184146/516280/penguin-publication/emperor-penguin\">Emperor penguin</a>" +
                    "    <img src=\"http://sdl.com/logo.png\" />" +
                    "    <a href=\"http://sdl.com\">SDL</a>" +
                    "    <p>some text inside tag with href=\"/test\" text</p>" +
                    "    <map name=\"planetmap\">" +
                    "        <area alt=\"Sun\" coords=\"0,0,82,126\" href=\"/sun.htm\" shape=\"rect\" />" +
                    "        <area alt=\"Mercury\" coords=\"90,58,3\" href=\"/mercur.htm\" shape=\"circle\" />" +
                    "        <area alt=\"Venus\" coords=\"124,58,8\" href=\"http://sdl.com/venus.htm\"" +
                    " shape=\"circle\" />" +
                    "    </map>" +
                    "</div>";

    @Test
    public void testUpdateHtmlBasePath() {
        String basePath = "/context-path";
        String updatedHtml = HtmlUtil.updateBasePath(SOURCE, basePath);
        String expected = "<h1>TopicTitle</h1>" +
                "<div class=\"body\">" +
                "    <img src=\"" + basePath + "/binary/1420746/345963/user-guide/330-picture\" />" +
                "    <a href=\"" + basePath + "/1184146/516280/penguin-publication/emperor-penguin\">Emperor penguin" +
                "</a>" +
                "    <img src=\"http://sdl.com/logo.png\" />" +
                "    <a href=\"http://sdl.com\">SDL</a>" +
                "    <p>some text inside tag with href=\"/test\" text</p>" +
                "    <map name=\"planetmap\">" +
                "        <area alt=\"Sun\" coords=\"0,0,82,126\" href=\"" + basePath + "/sun.htm\" shape=\"rect\" />" +
                "        <area alt=\"Mercury\" coords=\"90,58,3\" href=\"" + basePath + "/mercur.htm\" " +
                "shape=\"circle\" />" +
                "        <area alt=\"Venus\" coords=\"124,58,8\" href=\"http://sdl.com/venus.htm\" " +
                "shape=\"circle\" />" +
                "    </map>" +
                "</div>";

        assertEquals(expected, updatedHtml);
    }
}
