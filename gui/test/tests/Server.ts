/// <reference path="../../src/components/App.tsx" />
/// <reference path="../../src/Server.tsx" />

module Sdl.KcWebApp.Tests {

    class Server extends SDL.Client.Test.TestBase {

        public runTests(): void {

            describe(`Server side rendering tests.`, (): void => {

                it("renders", (): void => {
                    const app = renderToString("home");
                    const appElement = document.createElement("div");
                    appElement.innerHTML = app;
                    expect(appElement.children[0].innerHTML).toBe("<div></div>");
                });

            });

        }
    }

    new Server().runTests();
}
