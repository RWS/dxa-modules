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
            });
        });
    }
}

new UrlUtil().runTests();
