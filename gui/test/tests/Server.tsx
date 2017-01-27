import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { renderToString } from "Server";
import { App } from "components/container/App";
import { hashHistory } from "react-router";
import { localization } from "services/common/LocalizationService";
import { IServices } from "interfaces/Services";
import { PageService } from "services/server/PageService";
import { PublicationService } from "services/server/PublicationService";
import { TaxonomyService } from "services/server/TaxonomyService";
import { TestBase } from "sdl-models";

class Server extends TestBase {

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
                    <div className="sdl-dita-delivery-app sdl-dita-delivery-app-nav">
                        <div className="sdl-dita-delivery-topbar">
                            <div className="sdl-dita-delivery-nav-mask"></div>
                            <header>
                                <div className="sdl-dita-delivery-topbar-expand-nav"><span></span></div>
                                <div className="sdl-dita-delivery-topbar-logo" title="SDL">
                                    <a href="#/"></a>
                                </div>
                                <div className="sdl-dita-delivery-topbar-title"><label>Documentation</label></div>
                                <div className="sdl-dita-delivery-topbar-language"><span></span><label>English</label></div>
                                <div className="sdl-dita-delivery-topbar-user"><span></span></div>
                            </header>
                        </div>
                        <section className="sdl-dita-delivery-publication-content">
                            <div className="sdl-dita-delivery-searchbar">
                                <div className="input-area"><input type="text" placeholder="Search in ‘’" />
                                    <div className="search-button"></div>
                                </div>
                            </div>
                            <div className="sdl-dita-delivery-page"><span><div></div></span>
                                <div className="sdl-dita-delivery-navigation-menu">
                                    <nav className="sdl-dita-delivery-toc"><span><div></div></span><span className="separator"></span></nav>
                                </div>
                                <div className="sdl-dita-delivery-breadcrumbs">
                                    <ul>
                                        <li>
                                            <a className="home" title="Home" href="#/home">Home</a><span className="separator"></span>
                                        </li>
                                        <li>
                                            <a title="" href="#/123"></a><span className="separator"></span>
                                        </li>
                                    </ul>
                                </div>
                                <nav className="sdl-dita-delivery-content-navigation"></nav>
                                <article>
                                    <article className="page-content ltr"></article>
                                </article>
                            </div>
                        </section>
                    </div>));
                expect(app).toBe(expected);
            });
        });
    }
}

new Server().runTests();
