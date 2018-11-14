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
import { changeLanguage } from "store/actions/Actions";

//This tests has side effects affects, for some reason it influences Server.tsx
class LanguageReducer extends TestBase {
    public runTests(): void {
        describe("Test Language reducer", (): void => {
            let store: Store<IState>;

            // this is basically resets store's state, because of "KARMA_RESET" reducer.
            beforeEach(() => {
                store = configureStore();
            });

            // default language is setted in localizationService
            it("Should no have default language setted", (): void => {
                expect(store.getState().language).toBe("");
            });

            it("changeLanguage event should change lanaguge", (): void => {
                store.dispatch(changeLanguage("ru"));
                expect(store.getState().language).toBe("ru");

                // we don't really check that it's valid lanaguge
                store.dispatch(changeLanguage("xuz"));
                expect(store.getState().language).toBe("xuz");
            });

            it("changeLanguage event stores language in localStorage", (
                done: () => void
            ): void => {
                const language = "ua";
                spyOn(window.localStorage, "setItem").and.callFake((key: string, persistedData: string ): void => {
                    // Check if routing was called with correct params
                    expect(JSON.parse(persistedData).language).toBe(language);
                    done();
                });
                store.dispatch(changeLanguage(language));
            });
        });
    }
}

new LanguageReducer().runTests();
