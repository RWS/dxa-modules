import { Url } from "../../../src/utils/Url";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;

class UrlUtil extends TestBase {

    public runTests(): void {

        describe(`Url utils tests.`, (): void => {

            it("encodes url to safe format", (): void => {
                const publicationLocation = Url.getPublicationUrl("ish:777-1-1", "Veröffentlichung№пятьコンセプト");
                expect(publicationLocation).toBe("/ish%3A777-1-1/veroffentlichungpyat");
            });

            it("slugifies url to safe format", (): void => {
                const pageLocation = Url.getPageUrl("ish:777-1-1", "ish:1656863-164282-16", "Veröffentlichung № пять", "¿Qué? ●");
                expect(pageLocation).toBe("/ish%3A777-1-1/ish%3A1656863-164282-16/veroffentlichung-pyat/que");

                // TODO: Below are the tests from CD, which we should align with
                // // Plain US-ASCII chars
                // const withPlainASCII = Url.getPublicationUrl("ish:777-1-1",
                //     "Some Important Header"
                // );
                // expect(withPlainASCII).toBe("/ish%3A777-1-1/" +
                //     "some-important-header"
                // );

                // // With some punctuation chars
                // const withPunctuation = Url.getPublicationUrl("ish:777-1-1",
                //     "Title w/ !?-+<> chars...,"
                // );
                // expect(withPunctuation).toBe("/ish%3A777-1-1/" +
                //     "title-w---------chars----"
                // );

                // // With diacritics/accents
                // const withDiacriticsAccents = Url.getPublicationUrl("ish:777-1-1",
                //     "Plus ça change, plus c'est la même chose."
                // );
                // expect(withDiacriticsAccents).toBe("/ish%3A777-1-1/" +
                //     "plus-ca-change--plus-c-est-la-meme-chose-"
                // );

                // // With TCDL condition tags
                // const publicationLocationTCDLTags = Url.getPublicationUrl("ish:777-1-1",
                //     "Answering <tcdl:If type=\"ish:Condition\" condition=\"REJECTCALL=ENABLED\" " +
                //     "xmlns:tcdl=\"http://www.sdl.com/web/DXA/Format\">or rejecting</tcdl:if> a call",
                // );
                // expect(publicationLocationTCDLTags).toBe("/ish%3A777-1-1/" +
                //     "answering-or-rejecting-a-call"
                // );

                // // With UTF-8 chars
                // const publicationLocationUTF8 = Url.getPublicationUrl("ish:777-1-1",
                //     "你好 你好吗");
                // expect(publicationLocationUTF8).toBe("/ish%3A777-1-1/" +
                //     "%E4%BD%A0%E5%A5%BD-%E4%BD%A0%E5%A5%BD%E5%90%97"
                // );

                // // All combines (punctuation, TCD tag, UTF-8)
                // const publicationLocationAllCombines = Url.getPublicationUrl("ish:777-1-1",
                //     "你好 ! <tcdl:If type=\"ish:Condition\" condition=\"SOME-CONDITION=ENABLED\" " +
                //     "xmlns:tcdl=\"http://www.sdl.com/web/DXA/Format\">ça va ?</tcdl:if> Molto bene!");
                // expect(publicationLocationAllCombines).toBe("/ish%3A777-1-1/" +
                //     "%E4%BD%A0%E5%A5%BD---ca-va---molto-bene-"
                // );

                // // With UTF-8 chars resulting more than 250 chars (response is truncated at 250 chars)
                // const publicationLocationUTF8250 = Url.getPublicationUrl("ish:777-1-1",
                //     "编译实例  我们使用Scala编译器“scalac”来编译Scala代码。和大多数编译器一样，scalac 接受源文件名和一" +
                //     "些选项作为参数，生成一个或者多个目标文件");
                // expect(publicationLocationUTF8250).toBe("/ish%3A777-1-1/" +
                //     "%E7%BC%96%E8%AF%91%E5%AE%9E%E4%BE%8B--%E6%88%91%E4%BB%AC%E4%BD%BF%E7%94%A8scala%E7%BC%96" +
                //     "%E8%AF%91%E5%99%A8%E2%80%9Cscalac%E2%80%9D%E6%9D%A5%E7%BC%96%E8%AF%91scala%E4%BB" +
                //     "%A3%E7%A0%81%E3%80%82%E5%92%8C%E5%A4%A7%E5%A4%9A%E6%95%B0%E7%BC%96%E8%AF%91%E5" +
                //     "%99%"
                // );
            });
        });
    }
}

new UrlUtil().runTests();
