import { Store } from "redux";
import { TestBase } from "@sdl/models";
import { IState } from "store/interfaces/State";
import { configureStore } from "store/Store";
import { dialogOpen, dialogClose, applyConditions, updateEditingConditions } from "store/actions/Actions";
import { IConditionMap, ICondition } from "store/interfaces/Conditions";

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

            it("Actions dialogOpen and dialogClose should update state", () => {
                store.dispatch(dialogOpen());
                expect(store.getState().conditions.showDialog).toBeTruthy();

                store.dispatch(dialogClose());
                expect(store.getState().conditions.showDialog).toBeFalsy();

                //second time just in case
                store.dispatch(dialogClose());
                expect(store.getState().conditions.showDialog).toBeFalsy();
            });

            it("Actions updateEditingConditions updates state with editing condition", () => {
                const editingConditions: IConditionMap = {
                    Techs: {
                        values: ["localStorage"],
                        datatype: "Text",
                        range: false
                    } as ICondition
                };

                //second time just in case
                store.dispatch(updateEditingConditions(editingConditions));
                expect(store.getState().conditions.editingConditions).toEqual(editingConditions);

                //invalidates conditions when dialog is closed
                store.dispatch(dialogClose());
                expect(Object.keys(store.getState().conditions.editingConditions).length).toBe(0);
            });

            it("preserves lastConditions in localStorage, when apply conditions buttin is clicked", (
                done: () => void
            ): void => {
                const pubId = "0";
                const lastConditions: IConditionMap = {
                    Techs: {
                        values: ["localStorage"],
                        datatype: "Text",
                        range: false
                    } as ICondition
                };
                spyOn(window.localStorage, "setItem").and.callFake((key: string, persistedData: string): void => {
                    // Check if routing was called with correct params
                    expect(persistedData).toContain(
                        JSON.stringify({
                            [pubId]: lastConditions
                        })
                    );
                    done();
                    return;
                });
                store.dispatch(applyConditions(pubId, lastConditions));
            });
        });
    }
}

new ConditionsReducer().runTests();
