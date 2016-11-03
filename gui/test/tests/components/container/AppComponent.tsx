import { App } from "../../../../src/components/container/App";
import { DataStore } from "../../../mocks/services/DataStore";
import { routing } from "../../../mocks/Routing";
import { localization } from "../../../mocks/services/Localization";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;

const dataStoreMock = new DataStore();

class AppComponent extends TestBase {

    public runTests(): void {

        describe(`App component tests.`, (): void => {
            const target = super.createTargetElement();

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
                dataStoreMock.fakeDelay(false);
            });

            afterAll(() => {
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
        return ReactDOM.render(<App dataStore={dataStoreMock} routing={routing} localization={localization}/>, target) as App;
    }
}

new AppComponent().runTests();
