/// <reference path="../../../src/components/App.tsx" />

module Sdl.KcWebApp.Tests {

    import App = Components.App;

    class AppComponent extends SDL.Client.Test.TestBase {

        public runTests(): void {

            describe(`App component tests.`, (): void => {
                const target = super.createTargetElement();

                beforeAll(() => {
                    const appProps: Sdl.KcWebApp.Components.IAppProps = {
                        localization: {
                            formatMessage: (path, variables) => SDL.Globalize.formatMessage(path, variables)
                        }
                    };
                    ReactDOM.render(<App {...appProps}/>, target);
                });

                afterAll(() => {
                    const domNode = ReactDOM.findDOMNode(target);
                    ReactDOM.unmountComponentAtNode(domNode);
                    target.parentElement.removeChild(target);
                });

                it("renders", (): void => {
                    const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                    expect(domNode).not.toBeNull();
                    expect(domNode.querySelector(".sdl-activityindicator")).not.toBeNull("Could not find activity indicator.");
                });

            });

        }
    }

    new AppComponent().runTests();
}
