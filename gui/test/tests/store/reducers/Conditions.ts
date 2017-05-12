import { Store } from "redux";

import { TestBase } from "@sdl/models";

import { IState } from "store/interfaces/State";
import { configureStore } from "store/Store";
import { dialogRequestOpen, dialogRequestClose } from "store/actions/Actions";

class ConditionsReducer extends TestBase {

    public runTests(): void {
        describe("Test Conditions reducer", (): void => {
            let store: Store<IState>;

            // this is basically resets store's state, because of "KARMA_RESET" reducer.
            beforeEach(() => {
                store = configureStore();
            });

            // by default condition dialog is closed
            it("state.conditions.showDialog. Deafault for should be false", (): void => {
                expect(store.getState().conditions.showDialog).toBeFalsy();
            });

            it("Actions dialogRequestOpen and dialogRequestClose should update state", () => {
                store.dispatch(dialogRequestOpen());
                expect(store.getState().conditions.showDialog).toBeTruthy();

                store.dispatch(dialogRequestClose());
                expect(store.getState().conditions.showDialog).toBeFalsy();

                //second time just in case
                store.dispatch(dialogRequestClose());
                expect(store.getState().conditions.showDialog).toBeFalsy();
            });
        });
    }
}

new ConditionsReducer().runTests();