import { Url } from "utils/Url";
import { TestBase } from "@sdl/models";

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

            it("truncates titles to have maximum 250 characters", (): void => {
                const title = "¿Lorem ipsum dolor sit amet¿, consectetur adipiscing elit. Nunc eget est orci. " +
                    "Maecenas hendrerit nunc at magna semper, vitae pretium purus facilisis. Duis ac massa gravida, pharetra ligula vel, commodo nibh. " +
                    "Fusce quis lobortis risus. Sed cursus tristique porta. Nunc egestas velit quis felis finibus, ut lacinia ex interdum. " +
                    "Fusce ipsum turpis, tempus at ipsum vitae, luctus cursus mauris. Aliquam accumsan turpis ac commodo cursus. " +
                    "Duis dignissim rhoncus massa, et efficitur risus rhoncus ut. Curabitur viverra hendrerit purus eget accumsan. Etiam ac ligula augue.";
                const expectedTitle = "%C2%BFlorem-ipsum-dolor-sit-amet%C2%BF--consectetur-adipiscing-elit--nunc-eget-est-orci--" +
                    "maecenas-hendrerit-nunc-at-magna-semper--vitae-pretium-purus-facilisis--duis-ac-massa-gravida--pharetra-ligula-vel--commodo-nibh--" +
                    "fusce-quis-lobortis-risus--sed-";
                expect(expectedTitle.length).toBe(250); // 250 characters maximum

                const pageLocation = Url.getPageUrl("ish:777-1-1", "ish:1656863-164282-16", title, title);
                expect(pageLocation).toBe(`/ish%3A777-1-1/ish%3A1656863-164282-16/${expectedTitle}/${expectedTitle}`);

                const publicationLocation = Url.getPublicationUrl("ish:777-1-1", title);
                expect(publicationLocation).toBe(`/ish%3A777-1-1/${expectedTitle}`);
            });

            it("trims the titles on the url", (): void => {
                const title = " Activities \n          ";
                const expectedTitle = "activities";

                const pageLocation = Url.getPageUrl("pub-id", "page-id", title, title);
                expect(pageLocation).toBe(`/pub-id/page-id/${expectedTitle}/${expectedTitle}`);

                const publicationLocation = Url.getPublicationUrl("pub-id", title);
                expect(publicationLocation).toBe(`/pub-id/${expectedTitle}`);
            });

            it("parses page url correctly", (): void => {
                const urlWithOnlyIds = "/123/12345";
                expect(Url.parsePageUrl(urlWithOnlyIds)).toEqual({ publicationId: "123", pageId: "12345", publicationTitle: undefined, pageTitle: undefined });

                const urlWithOnlyPubtitle = "/123/12345/pub-title";
                expect(Url.parsePageUrl(urlWithOnlyPubtitle)).toEqual({ publicationId: "123", pageId: "12345", publicationTitle: "pub-title", pageTitle: undefined });

                const urlComplete = "/123/12345/pub-title/page-title";
                expect(Url.parsePageUrl(urlComplete)).toEqual({ publicationId: "123", pageId: "12345", publicationTitle: "pub-title", pageTitle: "page-title" });

                const contextPath = "/foo/bar/";
                const urlWithContextPath = `${contextPath}123/12345/pub-title/page-title`;
                expect(Url.parsePageUrl(urlWithContextPath, contextPath)).toEqual(
                    { publicationId: "123", pageId: "12345", publicationTitle: "pub-title", pageTitle: "page-title" });

                const invalidPageUrl = "/invalid-url";
                expect(Url.parsePageUrl(invalidPageUrl)).toBeUndefined();
            });

        });
    }
}

new UrlUtil().runTests();
