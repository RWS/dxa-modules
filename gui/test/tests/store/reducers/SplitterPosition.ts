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

import { Store } from "redux";
import { TestBase } from "@sdl/models";
import { IState } from "store/interfaces/State";
import { configureStore } from "store/Store";
import { splitterPositionChange } from "store/actions/Actions";

class SplitterPositionReducer extends TestBase {
    public runTests(): void {
        describe("Test Splitter Position reducer", (): void => {
            let store: Store<IState>;

            // this is basically resets store's state, because of "KARMA_RESET" reducer.
            beforeEach(() => {
                store = configureStore();
            });

            it("Should have default position set", (): void => {
                expect(store.getState().splitterPosition).not.toBe(0);
            });

            it("splitterPositionChange event should change splitter position", (): void => {
                store.dispatch(splitterPositionChange(123));
                expect(store.getState().splitterPosition).toBe(123);
            });
        });
    }
}

new SplitterPositionReducer().runTests();
