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

            it("Should no have default position set", (): void => {
                expect(store.getState().splitterPosition).toBe(0);
            });

            it("splitterPositionChange event should change splitter position", (): void => {
                store.dispatch(splitterPositionChange(123));
                expect(store.getState().splitterPosition).toBe(123);
            });
        });
    }
}

new SplitterPositionReducer().runTests();
