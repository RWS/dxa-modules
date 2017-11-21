import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { configureStore } from "store/Store";
import { Store } from "redux";
import { IState } from "store/interfaces/State";
import { Provider } from "react-redux";
import { IConditionMap, ICondition } from "store/interfaces/Conditions";

import { TestBase } from "@sdl/models";

import {
    ConditionsDialogPresentation,
    IConditionsDialogPresentationProps
} from "components/ConditionsDialog/ConditionsDialogPresentation";

class ConditionsDialogComponent extends TestBase {
    public runTests(): void {
        describe("<ConditionsDialog />", (): void => {
            const target = super.createTargetElement();

            const defaultProps: IConditionsDialogPresentationProps = {
                pubId: "0",
                isOpen: true,
                allConditions: {} as IConditionMap,
                editingConditions: {} as IConditionMap,
                open: () => {},
                close: () => {},
                apply: (pubId: string, conditions: IConditionMap) => {},
                change: (conditions: IConditionMap) => {}
            };

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("Renders conditions", (): void => {
                const allConditions: IConditionMap = {
                    Techs: {
                        values: ["React", "Redux", "Gulp", "WebPack"],
                        datatype: "Text",
                        range: false
                    } as ICondition,
                    Langs: {
                        values: ["JavaScript", "TypeScript", "Java"],
                        datatype: "Text",
                        range: false
                    } as ICondition
                };
                const component = this._renderComponent(
                    {
                        ...defaultProps,
                        allConditions
                    },
                    target
                );

                const appNode = ReactDOM.findDOMNode(component) as HTMLElement;
                const inputConditions = appNode.querySelectorAll("li label.sdl-conditions-dialog-condition-label");
                expect(inputConditions.length).toBe(2);
            });
        });
    }

    private _renderComponent(
        props: IConditionsDialogPresentationProps,
        target: HTMLElement
    ): ConditionsDialogPresentation {
        const store: Store<IState> = configureStore();

        const comp = ReactDOM.render(
            <ComponentWithContext>
                <Provider store={store}>
                    <ConditionsDialogPresentation {...props} />
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
