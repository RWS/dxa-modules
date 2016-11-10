import { Url } from "../../../src/utils/Url";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;

class UrlUtil extends TestBase {

    public runTests(): void {

        describe(`PublicationContent component tests.`, (): void => {
            const target = super.createTargetElement();

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            it("encodes url to safe format", (): void => {
                const publicationLocation = Url.getPublicationLocation("ish:777-1-1", "Veröffentlichung№пять");
                expect(publicationLocation).toBe("/ish%3A777-1-1/veroffentlichungpyat");
            });

            it("slugifies url to safe format", (): void => {
                const pageLocation = Url.getPageLocation("ish:777-1-1", "ish:1656863-164282-16", "Veröffentlichung № пять", "¿Qué? ●");
                expect(pageLocation).toBe("/ish%3A777-1-1/ish%3A1656863-164282-16/veroffentlichung-pyat/que");
            });

        });
    }
}

new UrlUtil().runTests();
