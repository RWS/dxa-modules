import { Store } from "redux";

import { TestBase } from "@sdl/models";

import { IState } from "store/interfaces/State";
import { configureStore } from "store/Store";
import { getPubList, getPubListErrorMessage } from "store/reducers/Reducer";
import { isPubsLoading } from "store/reducers/Reducer";
import { publicationsLoaded, publicationsLoading, publicationsLoadingError } from "store/actions/Api";
import { IPublication } from "interfaces/Publication";

const PUB_1: IPublication = {
    id: "1",
    title: "Пуб1",
    language: "ru",
    versionRef: "0001",
    createdOn: new Date(),
    version: "1",
    logicalId: "GUID-1",
    productFamily: "PF",
    productReleaseVersion: "PR1"
};

const PUB_2: IPublication = {
    id: "2",
    title: "Pub1",
    language: "en",
    versionRef: "0001",
    createdOn: new Date(),
    version: "1",
    logicalId: "GUID-2",
    productFamily: "PF",
    productReleaseVersion: "PR1"
};
class PublicationsReducer extends TestBase {

    public runTests(): void {
        describe("Test publications reducer", (): void => {
            let store: Store<IState>;

            //this is basically resets store's state, because of "KARMA_RESET" reducer.
            beforeEach(() => {
                store = configureStore();
            });

            it("Check default state", () => {
                const state = store.getState();
                expect(getPubList(state).length).toBe(0, "Should be empty on init");
                // probably need to rename isPubsLoading
                expect(isPubsLoading(state)).toBeFalsy();
                expect(getPubListErrorMessage(state)).toBe("");
            });

            it("Check publicationsLoaded", () => {
                store.dispatch(publicationsLoaded([PUB_1]));
                expect(getPubList(store.getState()).length).toBe(1);

                store.dispatch(publicationsLoaded([PUB_2]));
                expect(getPubList(store.getState()).length).toBe(2);

                store.dispatch(publicationsLoaded([PUB_1, PUB_2]));
                expect(getPubList(store.getState()).length).toBe(2, "Should stay same, because of same publications");
            });

            describe("Check loading state", () => {
                beforeEach(() => store.dispatch(publicationsLoading()));

                it("Check loading state", () => {
                    expect(isPubsLoading(store.getState())).toBeTruthy();
                });

                it("Check that success puts loading state back to false", () => {
                    store.dispatch(publicationsLoaded([]));

                    expect(isPubsLoading(store.getState())).toBeFalsy();
                });

                it("Check that error puts loading state back to false", () => {
                    store.dispatch(publicationsLoadingError("Error Message"));

                    expect(isPubsLoading(store.getState())).toBeFalsy();
                });
            });
        });
    }
};

new PublicationsReducer().runTests();
