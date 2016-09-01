/// <reference path="../../../../src/components/container/App.tsx" />
/// <reference path="../../../../src/global/client/RoutingClient.ts" />
/// <reference path="../../../../src/global/client/LocalizationGlobalize.ts" />

module Sdl.DitaDelivery.Tests {

    import App = Components.App;

    class AppComponent extends SDL.Client.Test.TestBase {

        public runTests(): void {

            describe(`App component tests.`, (): void => {
                const target = super.createTargetElement();
                const dataStoreMock = new Mocks.DataStore();

                beforeAll(() => {
                    Sdl.DitaDelivery.DataStore = dataStoreMock;
                    Sdl.DitaDelivery.Localization = new LocalizationGlobalize();
                    Sdl.DitaDelivery.Routing = new Mocks.Routing();
                });

                afterEach(() => {
                    const domNode = ReactDOM.findDOMNode(target);
                    ReactDOM.unmountComponentAtNode(domNode);
                    dataStoreMock.fakeDelay(false);
                });

                afterAll(() => {
                    Sdl.DitaDelivery.DataStore = null;
                    Sdl.DitaDelivery.Localization = null;
                    Sdl.DitaDelivery.Routing = null;
                    target.parentElement.removeChild(target);
                });

                it("show loading indicator on initial render", (): void => {
                    dataStoreMock.fakeDelay(true);
                    this._renderComponent(target);
                    const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                    expect(domNode).not.toBeNull();
                    expect(domNode.querySelector(".sdl-activityindicator")).not.toBeNull("Could not find activity indicator.");
                });
            });

        }

        private _renderComponent(target: HTMLElement): App {
            return ReactDOM.render(<App />, target) as App;
        }
    }

    new AppComponent().runTests();
}
