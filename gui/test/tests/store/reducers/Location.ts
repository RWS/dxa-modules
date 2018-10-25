import { Store } from "redux";

import { TestBase } from "@sdl/models";

import { IState } from "store/interfaces/State";
import { configureStore } from "store/Store";
import { getCurrentLocation } from "store/reducers/Reducer";
import { updateCurrentLocation } from "store/actions/Actions";

class LocationReducer extends TestBase {
    public runTests(): void {
        describe("Test Locations reducer", (): void => {
            let store: Store<IState>;

            //this is basically resets store's state, because of "KARMA_RESET" reducer.
            beforeEach(() => {
                store = configureStore();
            });

            it("Check default state", (): void => {
                const { publicationId, pageId, anchor } = getCurrentLocation(store.getState());

                expect(publicationId).toBe("");
                expect(pageId).toBe("");
                expect(anchor).toBe("");
            });

            describe("Check updateCurrentLocation", (): void => {
                it("publicationId", (): void => {
                    store.dispatch(updateCurrentLocation("11111", "", "", ""));
                    const { publicationId, pageId, anchor } = getCurrentLocation(store.getState());
                    expect(publicationId).toBe("11111");
                    expect(pageId).toBe("");
                    expect(anchor).toBe("");
                });

                it("publicationId, pageId", (): void => {
                    store.dispatch(updateCurrentLocation("11111", "22222", "", ""));
                    const { publicationId, pageId, anchor } = getCurrentLocation(store.getState());
                    expect(publicationId).toBe("11111");
                    expect(pageId).toBe("22222");
                    expect(anchor).toBe("");
                });

                it("publicationId, pageId, taxonomyId", (): void => {
                    store.dispatch(updateCurrentLocation("11111", "22222", "t33333-k44444", ""));
                    const { publicationId, pageId, taxonomyId } = getCurrentLocation(store.getState());
                    expect(publicationId).toBe("11111");
                    expect(pageId).toBe("22222");
                    expect(taxonomyId).toBe("t33333-k44444");
                });

                it("publicationId, pageId, taxonomyId, anchor", (): void => {
                    store.dispatch(updateCurrentLocation("11111", "22222", "t33333-k44444", "anchor"));
                    const { publicationId, pageId, taxonomyId, anchor } = getCurrentLocation(store.getState());
                    expect(publicationId).toBe("11111");
                    expect(pageId).toBe("22222");
                    expect(taxonomyId).toBe("t33333-k44444");
                    expect(anchor).toBe("anchor");
                });
            });
        });
    }
}

new LocationReducer().runTests();
