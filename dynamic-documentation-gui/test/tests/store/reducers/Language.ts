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
