import { renderToString } from "../../src/Server";
import { App } from "../../src/components/container/App";
import { hashHistory } from "react-router";
import { localization } from "../../src/services/server/LocalizationService";
import { IServices } from "../../src/interfaces/Services";
import { PageService } from "../../src/services/server/PageService";
import { PublicationService } from "../../src/services/server/PublicationService";
import { TaxonomyService } from "../../src/services/server/TaxonomyService";

class Server extends SDL.Client.Test.TestBase {

    public runTests(): void {

        describe(`Server side rendering tests.`, (): void => {

            it("renders", (): void => {
                const app = renderToString("home");
                const element = document.createElement("div");
                element.innerHTML = app;
                expect(element.children.length).toBe(1);
                const firstChild = element.children[0];
                expect(firstChild.classList).toContain("sdl-dita-delivery-app");
                expect(firstChild.childNodes.length).toBe(2);
            });

            it("renders correct static markup", (): void => {
                const services: IServices = {
                    pageService: new PageService(),
                    publicationService: new PublicationService(),
                    localizationService: localization,
                    taxonomyService: new TaxonomyService()
                };
                const app = ReactDOMServer.renderToStaticMarkup(<App history={hashHistory} services={services} />);
                const expected = ReactDOMServer.renderToStaticMarkup((
                    <div className="sdl-dita-delivery-app">
                        <span>
                            <span></span>
                        </span>
                        <section className="sdl-dita-delivery-publication-content">
                            <div className="sdl-dita-delivery-toc">
                                <span>
                                    <div></div>
                                </span>
                            </div>
                            <div className="sdl-dita-delivery-breadcrumbs">
                                <ul>
                                    <li>
                                        <a href="" title=""></a>
                                    </li>
                                </ul>
                            </div>
                            <div className="sdl-dita-delivery-page">
                                <span>
                                    <div></div>
                                </span>
                                <div>
                                    <div className="page-content ltr"></div>
                                </div>
                            </div>
                        </section>
                    </div>));
                expect(app).toBe(expected);
            });
        });
    }
}

new Server().runTests();
