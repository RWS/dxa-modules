import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import ReactDatePicker from "react-datepicker";
import { Store } from "redux";
import { Provider } from "react-redux";
import { configureStore } from "store/Store";
import { IState } from "store/interfaces/State";
import { IConditionMap, ICondition } from "store/interfaces/Conditions";
import { getEditingConditions, getLastConditions } from "store/reducers/Reducer";
import { dialogOpen } from "store/actions/Actions";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { PublicationService } from "test/mocks/services/PublicationService";
import { updateCurrentLocation, updateEditingConditions } from "src/store/actions/Actions";
import { ConditionsDialogPresentation } from "components/ConditionsDialog/ConditionsDialogPresentation";
import { ConditionsDialog } from "components/ConditionsDialog/ConditionsDialog";
import { RENDER_DELAY, ASYNC_DELAY } from "test/Constants";
import { TestBase } from "@sdl/models";
import { LabelManager } from "@sdl/controls-react-wrappers";

const services = {
    publicationService: new PublicationService()
};

class ConditionsDialogComponent extends TestBase {
    private store: Store<IState>;

    public runTests(): void {
        describe("<ConditionsDialog />", (): void => {
            const target = super.createTargetElement();
            const defaultPublicationId = "0";

            const sampleConditions: IConditionMap = {
                Techs: {
                    values: ["React", "Redux", "Gulp", "WebPack"],
                    datatype: "Text",
                    range: false
                } as ICondition,
                Langs: {
                    values: ["JavaScript"],
                    datatype: "Text",
                    range: true
                } as ICondition,
                StartDate: {
                    values: ["20180101"],
                    datatype: "Date",
                    range: true
                } as ICondition
            };

            beforeEach(() => {
                const store = (this.store = configureStore());
                store.dispatch(updateCurrentLocation(defaultPublicationId, "", "", ""));
                store.dispatch(dialogOpen());
            });

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("Renders different conditions types", (done: () => void): void => {
                services.publicationService.setMockDataConditions(null, sampleConditions);
                const component = this._renderComponent(target);

                const appNode = ReactDOM.findDOMNode(component) as HTMLElement;
                setTimeout((): void => {
                    const listItems = appNode.querySelectorAll(".sdl-conditions-dialog-list > li");
                    expect(listItems.length).toBe(3);

                    // Labels Field
                    const labelsValueNodes = listItems[0].querySelectorAll("input[type=text]") as NodeListOf<
                        HTMLInputElement
                    >;
                    expect(labelsValueNodes.length).toBe(2);
                    expect(labelsValueNodes[0].value).toBe(sampleConditions.Techs.values.join(","));
                    expect(labelsValueNodes[1].className).toContain("sdl-typeahead-input");

                    // Text Field
                    const textFieldValueNodes = listItems[1].querySelectorAll("input[type=text]");
                    expect(textFieldValueNodes.length).toBe(1, "Input text fiels should be defined");
                    // Functionality which refers to the line below is not implemented yet for some reason
                    // expect((textFieldValueNodes[0] as HTMLInputElement).value).toBe(sampleConditions.Langs.values[0]);

                    // Date Field
                    const dateFieldValueNodes = listItems[2].querySelectorAll("input[type=date]");
                    expect(dateFieldValueNodes.length).toBe(1, "Input date field shoud be defined");
                    // Functionality which refers to the line below is not implemented yet for some reason
                    // expect((dateFieldValueNodes[0] as HTMLInputElement).value).toBe(sampleConditions.StartDate.values[0]);

                    done();
                }, RENDER_DELAY);
            });

            it("Renders input condition type, and reacts on its change", (done: () => void): void => {
                const store = this.store;

                const Langs = sampleConditions.Langs;
                services.publicationService.setMockDataConditions(null, { Langs });

                const component = this._renderComponent(target);
                const appNode = ReactDOM.findDOMNode(component) as HTMLElement;

                setTimeout((): void => {
                    const submitButton = appNode.querySelector(
                        ".sdl-conditions-dialog-actions button.sdl-button-purpose-confirm"
                    ) as HTMLButtonElement;
                    expect(submitButton).toBeDefined();

                    const inputField = appNode.querySelector(
                        ".sdl-conditions-dialog-list > li input[type=text]"
                    ) as HTMLInputElement;
                    expect(inputField).toBeDefined();

                    const upgatedValue = "Typescript";

                    inputField.value = upgatedValue;
                    TestUtils.Simulate.change(inputField);

                    setTimeout((): void => {
                        // Changed conditions are going to editing conditions first
                        expect(getEditingConditions(store.getState()).Langs.values[0]).toBe(upgatedValue);

                        TestUtils.Simulate.click(submitButton);

                        setTimeout((): void => {
                            expect(Object.keys(getEditingConditions(store.getState())).length).toBe(0);
                            expect(getLastConditions(store.getState(), defaultPublicationId).Langs.values[0]).toBe(
                                upgatedValue
                            );

                            done();
                        }, RENDER_DELAY);
                    }, RENDER_DELAY);
                }, RENDER_DELAY);
            });

            it("Renders date picker control, and reacts on its change", (done: () => void): void => {
                const store = this.store;

                const StartDate = sampleConditions.StartDate;
                services.publicationService.setMockDataConditions(null, { StartDate });

                const component = this._renderComponent(target);

                setTimeout((): void => {
                    expect(Object.keys(getEditingConditions(store.getState())).length).toBe(0);

                    const datePicker = TestUtils.findRenderedComponentWithType(component, ReactDatePicker);
                    expect(datePicker).toBeDefined("Date picker control should be defined");
                    const inputField = ReactDOM.findDOMNode(datePicker).querySelector(
                        "input[type=text]"
                    ) as HTMLInputElement;
                    expect(inputField).toBeDefined();

                    TestUtils.Simulate.focus(inputField);
                    TestUtils.Simulate.keyDown(inputField, { key: "Enter" });

                    setTimeout((): void => {
                        // Changed conditions are going to editing conditions first
                        expect(getEditingConditions(store.getState()).StartDate.values[0]).toBeDefined();
                        done();
                    }, RENDER_DELAY);
                }, RENDER_DELAY);
            });

            it("Renders labels manager control", (done: () => void): void => {
                const store = this.store;

                const Techs = sampleConditions.Techs;
                const selectedValue = Techs.values[3];
                services.publicationService.setMockDataConditions(null, { Techs });

                store.dispatch(
                    updateEditingConditions({
                        Techs: {
                            ...Techs,
                            values: [selectedValue]
                        }
                    })
                );

                const component = this._renderComponent(target);
                setTimeout((): void => {
                    // tslint:disable-next-line:no-any
                    const labelManager = TestUtils.findRenderedComponentWithType(component, LabelManager as any);
                    expect(labelManager).toBeDefined("Label manager control should be defined");
                    const labelManagerNode = ReactDOM.findDOMNode(labelManager);
                    const tags = labelManagerNode.querySelectorAll("li.sdl-labelmanager-item .tag-value");
                    expect(tags.length).toBe(1);
                    expect(tags[0].textContent).toBe(selectedValue);

                    // Case 1. Can open tree view and select Item from there
                    const case1 = (callback: () => void) => {
                        const toggleButton = labelManagerNode.querySelector(".sdl-button") as HTMLButtonElement;
                        // Toggle On
                        toggleButton.click();

                        setTimeout((): void => {
                            const labelsTreeView = document.querySelector(".sdl-labelmanager-tree") as HTMLElement;
                            expect(labelsTreeView).toBeDefined();
                            const labels = labelsTreeView.querySelectorAll("li[data-type=Tag] .content span");
                            expect(labels.length).toBe(Techs.values.length);

                            const firstLabel = labels[0] as HTMLElement;
                            expect(firstLabel.textContent).toBe(Techs.values[0]);
                            firstLabel.click();
                            firstLabel.click();

                            setTimeout((): void => {
                                expect(
                                    labelManagerNode.querySelectorAll("li.sdl-labelmanager-item .tag-value").length
                                ).toBe(2);

                                // Toggle Off
                                toggleButton.click();

                                callback();
                            }, RENDER_DELAY);
                        }, RENDER_DELAY);
                    };

                    // Case 2. Can open Typeahead
                    const case2 = (callback: () => void) => {
                        const typeAheadInput = labelManagerNode.querySelector(
                            ".sdl-typeahead-input"
                        ) as HTMLInputElement;
                        expect(typeAheadInput).toBeDefined();
                        typeAheadInput.dispatchEvent(new Event("focus"));

                        setTimeout((): void => {
                            typeAheadInput.value = "re";
                            typeAheadInput.dispatchEvent(new Event("keyup"));

                            setTimeout((): void => {
                                const labelsTreeView = document.querySelector(
                                    ".sdl-typeahead-dropdown "
                                ) as Element;
                                expect(labelsTreeView).toBeDefined();
                                const labels = labelsTreeView.querySelectorAll(".suggestion");
                                expect(labels.length).toBe(2);
                                expect(labels[0].getAttribute("tooltip")).toBe("React");
                                expect(labels[1].getAttribute("tooltip")).toBe("Redux");

                                callback();
                            }, 500 + ASYNC_DELAY);
                        }, 10 + ASYNC_DELAY);
                    };

                    case1(() => {
                        case2(() => {
                            done();
                        });
                    });
                }, RENDER_DELAY);
            });

            it("handles conditions loading error", (done: () => void): void => {
                const errorMessage = "Conditions are invalid";
                const publicationId = "42";
                const store = this.store;

                store.dispatch(updateCurrentLocation(publicationId, "", "", ""));

                services.publicationService.setMockDataConditions(errorMessage);
                const component = this._renderComponent(target);
                const appNode = ReactDOM.findDOMNode(component) as HTMLElement;

                setTimeout((): void => {
                    expect(appNode).toBeDefined();
                    expect(store.getState().conditions.allConditions.errors[publicationId]).toBe(errorMessage);
                    done();
                }, RENDER_DELAY);
            });
        });
    }

    private _renderComponent(target: HTMLElement): ConditionsDialogPresentation {
        const comp = ReactDOM.render(
            <ComponentWithContext {...services}>
                <Provider store={this.store}>
                    <ConditionsDialog />
                </Provider>
            </ComponentWithContext>,
            target
        ) as React.Component<{}, {}>;

        return TestUtils.findRenderedComponentWithType(
            comp,
            ConditionsDialogPresentation
        ) as ConditionsDialogPresentation;
    }
}

new ConditionsDialogComponent().runTests();
