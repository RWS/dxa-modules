import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { renderToString } from "Server";
import { App } from "@sdl/dd/container/App/App";
import { localization } from "services/common/LocalizationService";
import { IServices } from "interfaces/Services";
import { PageService } from "services/server/PageService";
import { PublicationService } from "services/server/PublicationService";
import { TaxonomyService } from "services/server/TaxonomyService";
import { SearchService } from "services/server/SearchService";
import { TestBase } from "@sdl/models";
import { configureStore } from "store/Store";
import { Provider } from "react-redux";
import { Store } from "redux";
import { IState } from "store/interfaces/State";

class Server extends TestBase {
    private store: Store<IState>;
    public runTests(): void {

        describe(`Server side rendering tests.`, (): void => {

            beforeAll(() => {
                this.store = configureStore({
                    language: "en"
                });
            });

            it("renders", (): void => {
                const app = renderToString("home");
                const element = document.createElement("div");
                element.innerHTML = app;
                expect(element.children.length).toBe(1);
                const firstChild = element.children[0];
                expect(firstChild.classList).toContain("sdl-dita-delivery-app");
                expect(firstChild.childNodes.length).toBe(5);
            });

            it("renders correct static markup", (): void => {
                const services: IServices = {
                    pageService: new PageService(),
                    publicationService: new PublicationService(),
                    localizationService: localization,
                    taxonomyService: new TaxonomyService(),
                    searchService: new SearchService()
                };

                const localize = services.localizationService.formatMessage;

                const app = ReactDOMServer.renderToStaticMarkup(<Provider store={this.store}><App services={services} /></Provider>);
                const expected = ReactDOMServer.renderToStaticMarkup((
                    <div className="ltr sdl-dita-delivery-app">
                        <div />
                        <div className="sdl-dita-delivery-nav-mask"></div>
                        <div className="sdl-dita-delivery-topbar">
                            <header>
                                <div className="sdl-dita-delivery-topbar-logo" title="SDL">
                                    <a href="/home"></a>
                                </div>
                                <div className="spacer"></div>
                                <div className="sdl-dita-delivery-topbar-expand-nav"><span /></div>
                                <div className="sdl-dita-delivery-topbar-expand-search"><span></span></div>
                                <div className="sdl-dita-delivery-topbar-language"><span></span></div>
                                <div className="sdl-dita-delivery-dropdown">
                                    <button className="dropdown-toggle" type="button" data-toggle="dropdown">
                                        English
                                        <span className="caret"></span>
                                    </button>
                                    <div className="dropdown-menu">
                                        <div className="dropdown-arrow"></div>
                                        <ul className="dropdown-items">
                                            <li><a style={{"direction": "ltr"}}>Deutsch</a></li>
                                            <li className="active"><a style={{"direction": "ltr"}}>English<span className="checked"></span></a></li>
                                            <li><a style={{"direction": "ltr"}}>Nederlands</a></li>
                                            <li><a style={{"direction": "ltr"}}>中文</a></li>
                                            <li><a style={{"direction": "ltr"}}>日本語</a></li>
                                        </ul>
                                    </div>
                                    <select defaultValue="en">
                                        <option value="de">Deutsch</option>
                                        <option value="en">English</option>
                                        <option value="nl">Nederlands</option>
                                        <option value="zh">中文</option>
                                        <option value="ja">日本語</option>
                                    </select>
                                </div>
                                <div className="sdl-dita-delivery-topbar-user"><span></span></div>
                            </header>
                        </div>
                        <div className="sdl-dita-delivery-searchbar">
                            <div className="input-area"><input type="text" placeholder="" />
                                <div className="search-button"></div>
                            </div>
                        </div>
                        <div className="sdl-dita-delivery-publication-content-wrapper">
                            <div />
                            <div />
                            <div />
                            <div />
                            <section className="sdl-dita-delivery-publication-content">
                                <div className="sdl-dita-delivery-page">
                                    <div className="sdl-dita-delivery-navigation-menu">
                                        <nav className="sdl-dita-delivery-toc">
                                            <div className="sdl-conditions-dialog-presentation">
                                                <div className="sdl-conditions-fetcher"></div>
                                                <button className="sdl-button-text sdl-personalize-content" disabled>
                                                    <span>{localize("components.conditions.dialog.title")}</span>
                                                </button>
                                                <div className="sdl-dialog-container">
                                                    <div className="sdl-dialog-wrapper"></div>
                                                </div>
                                            </div>
                                            <span><div></div></span><span className="separator"></span></nav>
                                    </div>
                                    <div className="sdl-dita-delivery-breadcrumbs">
                                        <ul className="breadcrumbs">
                                            <li><a className="home" title="Home" href="/home">{localize("components.breadcrumbs.home")}</a></li>
                                        </ul>
                                    </div>
                                    <div />
                                    <div className="sdl-dita-delivery-version-selector">
                                        <label>{localize("productreleaseversions.version.label")}</label>
                                        <span>
                                            <div/>
                                        </span>
                                    </div>
                                    <div className="sdl-dita-delivery-content-navigation-wrapper">
                                        <nav className="sdl-dita-delivery-content-navigation"></nav>
                                    </div>
                                    <article>
                                        <article className="ltr page-content">{localize("components.page.nothing.selected")}</article>
                                    </article>
                                    <div className="sdl-dita-delivery-comments-section">
                                        <div>
                                            <div className="sdl-dita-delivery-postcomment">
                                                <form id="form">
                                                    <div>
                                                        <label htmlFor="name">{localize("component.post.comment.name")}<span>*</span>
                                                        </label>
                                                        <input type="text" className="sdl-input-text" id="name"
                                                            placeholder={localize("component.post.comment.placeholder.name")} />
                                                        <span>{localize("component.post.comment.no.name")}</span>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="email">{localize("component.post.comment.email")}<span>*</span>
                                                        </label>
                                                        <input type="text" className="sdl-input-text" id="email"
                                                            placeholder={localize("component.post.comment.placeholder.email")} />
                                                        <span>{localize("component.post.comment.no.email")}</span>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="comment">{localize("component.post.comment.content")}<span>*</span>
                                                        </label>
                                                        <textarea className="sdl-textarea" id="comment"
                                                            placeholder={localize("component.post.comment.placeholder.content")} />
                                                        <span>{localize("component.post.comment.no.content")}</span>
                                                    </div>
                                                    <button type="submit" disabled className="sdl-button graphene sdl-button-purpose-confirm" form="form" value="Submit">
                                                        {localize("component.post.comment.submit")}
                                                    </button>
                                                </form>
                                            </div>
                                            <div className="sdl-dita-delivery-comments-list">
                                                <div className="sdl-comments-fetcher" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>));
                expect(app).toBe(expected);
            });
        });
    }
}

new Server().runTests();
