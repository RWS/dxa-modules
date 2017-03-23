import { Store } from "redux";

import { TestBase } from "sdl-models";

import { IState } from "store/interfaces/State";
import { configureStore } from "store/Store";
import { getCurrentPub } from "store/reducers/Reducer";
import { publicationRouteChanged } from "store/actions/Actions";

class PublicationReducer extends TestBase {

    public runTests(): void {
        describe("Test Language reducer", (): void => {
            let store: Store<IState>;

            //this is basically resets store's state, because of "KARMA_RESET" reducer.
            beforeEach(() => {
                store = configureStore();
            });

            it("Check default state", (): void => {
                const { publicationId, pageId, anchor } = getCurrentPub(store.getState());

                expect(publicationId).toBe("");
                expect(pageId).toBe("");
                expect(anchor).toBe("");
            });

            describe("Check publicationRouteChanged", (): void => {
                it("publicationId", (): void => {
                    store.dispatch(publicationRouteChanged("11111"));
                    const { publicationId, pageId, anchor } = getCurrentPub(store.getState());
                    expect(publicationId).toBe("11111");
                    expect(pageId).toBe("");
                    expect(anchor).toBe("");
                });

                it("publicationId, pageId", (): void => {
                    store.dispatch(publicationRouteChanged("11111", "22222"));
                    const { publicationId, pageId, anchor } = getCurrentPub(store.getState());
                    expect(publicationId).toBe("11111");
                    expect(pageId).toBe("22222");
                    expect(anchor).toBe("");
                });

                it("publicationId, pageId, anchor", (): void => {
                    store.dispatch(publicationRouteChanged("11111", "22222", "anchor"));
                    const { publicationId, pageId, anchor } = getCurrentPub(store.getState());
                    expect(publicationId).toBe("11111");
                    expect(pageId).toBe("22222");
                    expect(anchor).toBe("anchor");
                });
            });
        });
    }
};

new PublicationReducer().runTests();
