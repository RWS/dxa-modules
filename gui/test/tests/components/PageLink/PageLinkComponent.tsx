import * as React from "react";
import * as ReactDOM from "react-dom";
import { TestBase } from "@sdl/models";
import { Store } from "redux";
import { IState } from "store/interfaces/State";
import { configureStore } from "store/Store";
import { Provider } from "react-redux";
import { PageLink } from "@sdl/dd/PageLink/PageLink";
import { publicationsLoaded } from "src/store/actions/Api";

const TestPub = {
    id: "00001",
    title: "TestPub",
    createdOn: new Date(),
    version: "1",
    logicalId: "GUID-1",
    productFamily: "PF",
    productReleaseVersion: "PR1"
};

// const TestPage = {
//     id: "00002",
//     title: "TestPage"
// };

/* Fake test, but good coverage :) */
class TilesListComponent extends TestBase {
    private store: Store<IState>;
    public runTests(): void {
        describe("<PageLink />", (): void => {
            const target = super.createTargetElement();

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            beforeEach(() => {
                this.store = configureStore();
                this.store.dispatch(publicationsLoaded([TestPub]));
            });

            it("renders tiles list", (): void => {
                this._renderComponent(target, TestPub.id);
            });
        });
    }

    private _renderComponent(target: HTMLElement, publicationId: string, pageId?: string): void {
        ReactDOM.render(
            (
                <Provider store={this.store}>
                    <PageLink publicationId={publicationId} pageId={pageId} />
                </Provider>
            ), target) as React.Component<{}, {}>;
        // return TestUtils.findRenderedComponentWithType(comp, PageLink) as PageLink;
    }
}

new TilesListComponent().runTests();
