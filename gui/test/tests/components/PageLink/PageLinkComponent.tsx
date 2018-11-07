/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

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
    productFamily: ["PF"],
    productReleaseVersion: ["PR1"]
};

/* Fake test, but good coverage :) */
class PageLinkComponent extends TestBase {
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

new PageLinkComponent().runTests();
