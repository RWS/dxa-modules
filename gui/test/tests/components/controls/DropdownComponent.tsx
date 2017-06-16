import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { Dropdown, IDropdownProps } from "@sdl/dd/Dropdown/Dropdown";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "@sdl/models";

class DropdownComponent extends TestBase {

    public runTests(): void {

        describe(`Dropdown component tests.`, (): void => {
            const target = super.createTargetElement();
            const englishLanguage = {text: "English", value: "en"};
            const dutchLanguage = {text: "Nederlands", value: "nl"};
            const languages = [
                englishLanguage,
                dutchLanguage,
                {text: "Deutsch", value: "de"},
                {text: "Русский", value: "ru"},
                {text: "ქართული", value: "ka"},
                {text: "עברית", value: "he"},
                {text: "العربية", value: "ar"},
                {text: "中文", value: "zh"}
            ];
            const onClickItem = jasmine.createSpy("itemSpy");

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("Correct component render", (): void => {
                const dropdown = this._renderComponent({items: [englishLanguage]}, target);
                const dropdownNode = ReactDOM.findDOMNode(dropdown);
                const dropdownButton = dropdownNode.querySelector(".dropdown-toggle") as HTMLButtonElement;
                const dropdownMenu = dropdownNode.querySelector(".dropdown-menu");
                const dropdownItems = dropdownNode.querySelector(".dropdown-items");
                const dropdownArrow = dropdownNode.querySelector(".dropdown-arrow");
                const dropdownItem = dropdownNode.querySelector(".dropdown-items li");
                const dropdownSelect = dropdownNode.querySelector("select");
                const dropdownOption = dropdownNode.querySelector("select option");

                expect(dropdownButton).not.toBeNull();
                expect(dropdownButton.textContent).toBe(englishLanguage.text);
                expect(dropdownMenu).not.toBeNull();
                expect(dropdownItems).not.toBeNull();
                expect(dropdownArrow).not.toBeNull();
                expect(dropdownItem).not.toBeNull();
                expect(dropdownSelect).not.toBeNull();
                expect(dropdownOption).not.toBeNull();
            });

            it("Correct component props", (): void => {
                const dropdown = this._renderComponent({items: languages, selected: dutchLanguage}, target);
                const dropdownNode = ReactDOM.findDOMNode(dropdown);
                const dropdownComponent = TestUtils.findRenderedComponentWithType(dropdown, Dropdown) as Dropdown;
                const dropdownItems = dropdownNode.querySelectorAll(".dropdown-items li");
                const dropdownButton = dropdownNode.querySelector(".dropdown-toggle") as HTMLButtonElement;
                const dropdownOption = dropdownNode.querySelectorAll("select option");

                expect(dropdownItems.length).toBe(languages.length);
                expect(dropdownButton.textContent).toBe(dutchLanguage.text);
                expect(dropdownComponent.getValue()).toBe(dutchLanguage.value);
                expect(dropdownComponent.getText()).toBe(dutchLanguage.text);
                expect(dropdownOption.length).toBe(languages.length);
            });

            it("Correct component placeHolder", (): void => {
                const dropdown = this._renderComponent({items: languages, placeHolder: "Select language"}, target);
                const dropdownNode = ReactDOM.findDOMNode(dropdown);
                const dropdownButton = dropdownNode.querySelector(".dropdown-toggle") as HTMLButtonElement;
                const dropdownComponent = TestUtils.findRenderedComponentWithType(dropdown, Dropdown) as Dropdown;

                expect(dropdownButton).not.toBeNull();
                expect(dropdownButton.textContent).toBe("Select language");
                expect(dropdownComponent.getValue()).toBe(null);
                expect(dropdownComponent.getText()).toBe(null);
            });

            it("Toggle dropdown", (): void => {
                const dropdown = this._renderComponent({items: languages, placeHolder: "Select language"}, target);
                const dropdownNode = ReactDOM.findDOMNode(dropdown);
                const dropdownButton = dropdownNode.querySelector(".dropdown-toggle") as HTMLButtonElement;
                const dropdownComponent = TestUtils.findRenderedComponentWithType(dropdown, Dropdown) as Dropdown;
                const dropdownMenu = dropdownNode.querySelector(".dropdown-menu") as HTMLElement;

                function openChecks(): void {
                    expect(getComputedStyle(dropdownMenu).display).toBe("block");
                    expect(dropdownComponent.isOpen()).toBe(true);
                    expect((dropdownNode.querySelector(".sdl-dita-delivery-dropdown") as HTMLElement).classList).toContain("open");
                }

                function closeChecks(): void {
                    expect(getComputedStyle(dropdownMenu).display).toBe("none");
                    expect(dropdownComponent.isOpen()).toBe(false);
                    expect((dropdownNode.querySelector(".sdl-dita-delivery-dropdown") as HTMLElement).classList).not.toContain("open");
                }

                closeChecks();

                dropdownComponent.toggleOn();
                openChecks();

                TestUtils.Simulate.click(dropdownButton as HTMLElement);
                closeChecks();

                dropdownComponent.toggle();
                openChecks();
            });

            it("Dropdown item click", (): void => {
                const dropdown = this._renderComponent({items: languages, selected: languages[0], onChange: (index): void => onClickItem()}, target);
                const dropdownNode = ReactDOM.findDOMNode(dropdown);
                const dropdownComponent = TestUtils.findRenderedComponentWithType(dropdown, Dropdown) as Dropdown;
                const dropdownItems = dropdownNode.querySelectorAll(".dropdown-menu li");

                expect(dropdownItems[0].classList).toContain("active");
                expect(onClickItem).not.toHaveBeenCalled();
                expect(dropdownComponent.getValue()).toBe(languages[0].value);
                expect(dropdownComponent.getText()).toBe(languages[0].text);

                dropdownComponent.toggleOn();
                TestUtils.Simulate.click(dropdownItems[1] as HTMLElement);

                expect(dropdownItems[0].classList).not.toContain("active");
                expect(dropdownItems[1].classList).toContain("active");
                expect(onClickItem).toHaveBeenCalled();
            });
        });
    }

    private _renderComponent(props: IDropdownProps, target: HTMLElement): ComponentWithContext {
        return ReactDOM.render(<ComponentWithContext><Dropdown {...props} /></ComponentWithContext>, target) as ComponentWithContext;
    }
}

new DropdownComponent().runTests();
