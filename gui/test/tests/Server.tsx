/// <reference path="../../src/components/container/App.tsx" />
/// <reference path="../../src/Server.tsx" />

module Sdl.DitaDelivery.Tests {

    class Server extends SDL.Client.Test.TestBase {

        public runTests(): void {

            describe(`Server side rendering tests.`, (): void => {

                beforeAll(() => {
                    Sdl.DitaDelivery.DataStore = new DataStoreServer();
                    Sdl.DitaDelivery.Localization = new LocalizationServer();
                    Sdl.DitaDelivery.Routing = new RoutingServer();
                });

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
                    const app = ReactDOMServer.renderToStaticMarkup(<App />);
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
                                <div className="sdl-dita-delivery-page">
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
}
