package com.sdl.dxa.modules.ish.utils;

/**
 * Utility class which contains functionality for manipulation html content of a topic body.
 */
public class HtmlUtil {
    private static final String HTML_REFS_REGEX = "(<[^>]*(?:href|src|data|cite|poster)\\s*=\\s*\")(\\/[^\"]*)(\")";

    /**
     * Update base path. Eg needed when deploying under different context then the root.
     *
     * @param topicBody   Topic body
     * @param contextPath Context path
     * @return Processed html with paths which include the context path
     */
    public static String updateBasePath(String topicBody, String contextPath) {
        if (contextPath.equals("")) {
            // Base path is already pointing to the root
            return topicBody;
        }
        return topicBody.replaceAll(HTML_REFS_REGEX, "$1" + contextPath + "$2$3");
    }
}
