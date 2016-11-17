import { Url } from "../../../src/utils/Url";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;

class UrlUtil extends TestBase {

    public runTests(): void {

        describe(`Url utils tests.`, (): void => {

            it("encodes publication url to safe format", (): void => {
                const publicationLocation = Url.getPublicationUrl("ish:777-1-1", "Veröffentlichung№пятьコンセプト");
                expect(publicationLocation).toBe("/ish%3A777-1-1/veroffentlichung%E2%84%96%D0%BF%D1%8F%D1%82%D1%8C%E3%82%B3%E3%83%B3%E3%82%BB%E3%83%97%E3%83%88");
            });

            it("encodes page url to safe format", (): void => {
                const pageLocation = Url.getPageUrl("ish:777-1-1", "ish:1656863-164282-16", "Veröffentlichung № пять", "¿Qué? ●");
                expect(pageLocation).toBe("/ish%3A777-1-1/ish%3A1656863-164282-16/veroffentlichung-%E2%84%96-%D0%BF%D1%8F%D1%82%D1%8C/%C2%BFque--%E2%97%8F");
            });

        });
    }
}

new UrlUtil().runTests();
