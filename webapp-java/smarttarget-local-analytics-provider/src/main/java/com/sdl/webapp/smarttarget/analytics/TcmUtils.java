package com.sdl.webapp.smarttarget.analytics;

import java.util.StringTokenizer;

/**
 * TcmUtils
 *
 * @author nic
 */
public final class TcmUtils {

    private TcmUtils() {}


    public static String buildPublicationTcmUri(int publicationId) {
        return "tcm:0-" + publicationId + "-1";
    }

    public static String buildPublicationTargetTcmUri(int publicationTargetId) {
        return "tcm:0-" + publicationTargetId + "-65537";
    }

    public static String buildComponentTcmUri(int publicationId, int componentId) {
        return "tcm:" + publicationId + "-" + componentId;
    }

    public static String buildPageTcmUri(int publicationId, int pageId) {
        return "tcm:" + publicationId + "-" + pageId;
    }

    public static String buildComponentTemplateTcmUri(int publicationId, int componentTemplateId) {
        return "tcm:" + publicationId + "-" + componentTemplateId + "-32";
    }

    static public int extractItemIdFromTcmUri(String publicationTargetId) {
        StringTokenizer tokenizer = new StringTokenizer(publicationTargetId, ":-");
        if ( tokenizer.countTokens() > 2 ) {
            tokenizer.nextToken();
            tokenizer.nextToken();
            return Integer.parseInt(tokenizer.nextToken());
        }
        return -1;
    }
}
