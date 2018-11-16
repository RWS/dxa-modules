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
import { getPubsByLang, normalizeProductFamily, normalizeProductReleaseVersion,
    translateProductReleaseVersion, translateProductReleaseVersions, getPubListRepresentatives } from "store/reducers/Reducer";
import { DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE, DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION } from "models/Publications";
import { configureStore } from "store/Store";
import { IPublicationsListPropsParams } from "@sdl/dd/PublicationsList/PublicationsListPresentation";
import { String } from "utils/String";

//This tests has side effects affects, for some reason it influences Server.tsx
class LanguageReducer extends TestBase {

    public runTests(): void {
        describe("Test Reducer", (): void => {
            let store: Store<IState>;

            // this is basically resets store's state, because of "KARMA_RESET" reducer.
            beforeEach(() => {
                store = configureStore();
            });

            it("Should not have defalut publications on english", (): void => {
                expect(getPubsByLang(store.getState(), "en").length).toBe(0);
            });

            it("Check normalizeProductFamily transform", (): void => {
                expect(normalizeProductFamily({"productFamily": DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE})).toBe(null);
                expect(normalizeProductFamily({"productFamily": "Product family"})).toBe("Product family");
            });

            it("Check normalizeProductReleaseVersion transform", (): void => {
                const nullParams = {"productReleaseVersion": DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION};
                const notNullParams = {"productReleaseVersion": "Product Value"};
                expect(normalizeProductReleaseVersion(<IPublicationsListPropsParams>nullParams)).toBe(null);
                expect(normalizeProductReleaseVersion("")).toBe("");
                expect(normalizeProductReleaseVersion(<IPublicationsListPropsParams>notNullParams)).toBe("Product Value");
                expect(normalizeProductReleaseVersion("Product Value")).toBe("Product Value");
            });

            it("Check product release version translation", (): void => {
                expect(translateProductReleaseVersion(DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION)).toBe(DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION);
                expect(translateProductReleaseVersion("Product Release Version")).toBe("Product Release Version");
            });

            it("Check product release versions translation", (): void => {
                let versions = [];
                versions.push({value: String.normalize(DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION), title: DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION});
                versions.push({value: "value", title: "title"});
                expect(translateProductReleaseVersions(versions)).toEqual([{
                    value: String.normalize(DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION),
                    title: DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION
                }, {
                    value: "value",
                    title: "title"
                }]);
            });

            // Need to be covered more
            it("Check product families representatives", (): void => {
                expect(getPubListRepresentatives(store.getState(), {}).length).toBe(0);
            });
        });
    }
};

new LanguageReducer().runTests();
