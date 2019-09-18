package com.sdl.dxa.modules.ish.services;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;

import static org.junit.Assert.assertEquals;

@RunWith(MockitoJUnitRunner.class)
public class GraphQLPageServiceTest {
    @Spy
    private  GraphQLPageService service;

    private String topicBody =
            " <div>  <p class=\"shortdesc\"><a class=\"xref\" href=\"http://localhost:8883/12345/9876/test-page/test-page/anchortext?/cases/view/30950923/778236\">text</a></p>\n" +
            "   <p class=\"shortdesc\"><a class=\"xref\" href=\"http://nl1tr01.global.sdl.corp/testrail/index.php?/cases/view/30950923\" target=\"_blank\">http://nl1tr01.global.sdl.corp/testrail/index.php?/cases/view/30950923</a></p>\n" +
            "   <p class=\"p\"><strong class=\"ph b\">Language <em class=\"ph i\">localisation</em></strong> (or <strong class=\"ph b\"><em class=\"ph i\">localization</em></strong>, see <a class=\"xref\" href=\"HTTPS://EN.WIKIPEDIA.html#ISEIZE\">spelling-differences</a>) is the process of adapting a product that has been previously translated into multiple languages to a specific country or\n" +
            "       region (from <a class=\"xref\" href=\"HTTPS://EN.WIKIPEDIA.html\">Latin</a> <em class=\"ph i\">locus</em> (place) and the English term <em class=\"ph i\"><a class=\"xref\" href=\"HTTPS://EN.WIKIPEDIA.html\">locale</a></em>, \"a place where something happens or is set\")." +
                    "<a href=\"/1962357/1962333/test-data-map/prolog-element-with-author/fntarg_1\" name=\"fnsrc_1\"><sup>1</sup></a> It is the second phase of a larger process of product translation and cultural adaptation (for specific countries, regions\n" +
            "       or groups) to account for differences in distinct markets, a process known as <a class=\"xref\" href=\"HTTPS://EN.WIKIPEDIA.html\">internationalisation and localisation</a>.\n" +
            "   </p>\n" +
            "   <p class=\"p\">Language localisation differs from <a class=\"xref\" href=\"HTTPS://EN.WIKIPEDIA.html\">translation activity</a> because it involves a comprehensive study of the target culture in order to correctly adapt the product to local needs. Localisation\n" +
            "       can be referred to by the <a class=\"xref\" href=\"HTTPS://EN.WIKIPEDIA.html\">numeronym</a><strong class=\"ph b\"> L10N</strong> (as in: \"L\", followed by ten more letters, and then \"N\").\n" +
            "   </p>\n</div>" +
            "<div class=\"fn\"><a href=\"/1962357/1962333/test-data-map/prolog-element-with-author/fnsrc_1\" name=\"fntarg_1\"><sup>1</sup></a>  \"locale\". <em class=\"ph i\">The New Oxford American Dictionary</em> (2nd ed.). Oxford University Press. 2005.\n</div>";

    String expectedBody =
            " <div>  <p class=\"shortdesc\"><a class=\"xref\" href=\"#anchortext\">text</a></p>\n" +
            "   <p class=\"shortdesc\"><a class=\"xref\" href=\"http://nl1tr01.global.sdl.corp/testrail/index.php?/cases/view/30950923\" " +
                    "target=\"_blank\">http://nl1tr01.global.sdl.corp/testrail/index.php?/cases/view/30950923</a></p>\n" +
            "   <p class=\"p\"><strong class=\"ph b\">Language <em class=\"ph i\">localisation</em></strong> (or <strong class=\"ph b\"><em class=\"ph i\">localization</em></strong>, see <a class=\"xref\" href=\"HTTPS://EN.WIKIPEDIA.html#ISEIZE\">spelling-differences</a>) is the process of adapting a product that has been previously translated into multiple languages to a specific country or\n" +
            "       region (from <a class=\"xref\" href=\"HTTPS://EN.WIKIPEDIA.html\">Latin</a> <em class=\"ph i\">locus</em> (place) and the English term <em class=\"ph i\"><a class=\"xref\" href=\"HTTPS://EN.WIKIPEDIA.html\">locale</a></em>, \"a place where something happens or is set\")." +
                    "<a href=\"#fntarg_1\" name=\"fnsrc_1\"><sup>1</sup></a> It is the second phase of a larger process of product translation and cultural adaptation (for specific countries, regions\n" +
            "       or groups) to account for differences in distinct markets, a process known as <a class=\"xref\" href=\"HTTPS://EN.WIKIPEDIA.html\">internationalisation and localisation</a>.\n" +
            "   </p>\n" +
            "   <p class=\"p\">Language localisation differs from <a class=\"xref\" href=\"HTTPS://EN.WIKIPEDIA.html\">translation activity</a> because it involves a comprehensive study of the target culture in order to correctly adapt the product to local needs. Localisation\n" +
            "       can be referred to by the <a class=\"xref\" href=\"HTTPS://EN.WIKIPEDIA.html\">numeronym</a><strong class=\"ph b\"> L10N</strong> (as in: \"L\", followed by ten more letters, and then \"N\").\n" +
            "   </p>\n" +
            "</div><div class=\"fn\"><a href=\"#fnsrc_1\" name=\"fntarg_1\"><sup>1</sup></a>  \"locale\". <em class=\"ph i\">The New Oxford American Dictionary</em> (2nd ed.). Oxford University Press. 2005.\n" +
            "</div>";

    @Test
    public void shouldReplaceLinksWithAnchors() {
        assertEquals(expectedBody, service.replaceAnchorInLinks(topicBody));
    }
}