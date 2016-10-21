import { renderToString } from "../../src/Server";
import { App } from "../../src/components/container/App";
import { routing } from "../../src/global/server/RoutingServer";
import { localization } from "../../src/global/server/LocalizationServer";
import { DataStoreServer } from "../../src/global/server/DataStoreServer";

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
                const dataStore = new DataStoreServer();
                const app = ReactDOMServer.renderToStaticMarkup(<App routing={routing} localization={localization} dataStore={dataStore} />);
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
