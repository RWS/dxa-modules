import { Store } from "redux";

import { TestBase } from "sdl-models";

import { IState } from "store/interfaces/State";
import { getPubsByLang, getProductFamily, getProductReleaseVersion,
    translateProductReleaseVersion, translateProductReleaseVersions, getPubListRepresentatives } from "store/reducers/Reducer";
import { DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE, DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION } from "models/Publications";
import { configureStore } from "store/Store";
import { IPublicationsListPropsParams } from "components/PublicationsList/PublicationsListPresentation";
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

            it("Check getProductFamily transform", (): void => {
                expect(getProductFamily({"productFamily": DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE})).toBe(null);
                expect(getProductFamily({"productFamily": "Product family"})).toBe("Product family");
            });

            it("Check getProductReleaseVersion transform", (): void => {
                const nullParams = {"productReleaseVersion": DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION};
                const notNullParams = {"productReleaseVersion": "Product Value"};
                expect(getProductReleaseVersion(<IPublicationsListPropsParams>nullParams)).toBe(null);
                expect(getProductReleaseVersion("")).toBe("");
                expect(getProductReleaseVersion(<IPublicationsListPropsParams>notNullParams)).toBe("Product Value");
                expect(getProductReleaseVersion("Product Value")).toBe("Product Value");
            });

            it("Check product release version translation", (): void => {
                expect(translateProductReleaseVersion(DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION)).toBe(DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION);
                expect(translateProductReleaseVersion("Product Release Version")).toBe("Product Release Version");
            });

            it("Check product release versions translation", (): void => {
                let versions = [];
                versions.push({value: DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION, title: DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION});
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
