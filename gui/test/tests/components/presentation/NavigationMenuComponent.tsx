import * as React from "react";
import * as ReactDOM from "react-dom";
import { NavigationMenu, INavigationMenuProps } from "components/presentation/NavigationMenu";
import { TestBase } from "sdl-models";

class NavigationMenuComponent extends TestBase {

    public runTests(): void {

        describe(`Navigation Menu tests`, (): void => {
            const target = super.createTargetElement();

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                target.parentElement.removeChild(target);
            });

            it("renders", (): void => {
                this._renderComponent({
                    isOpen: false
                }, target);
                const element = document.querySelector(".sdl-dita-delivery-navigation-menu");
                expect(element).not.toBeNull();
                expect(element.innerHTML).toBe("<div>Contents</div>");
            });

            it("can open/close", (done: () => void): void => {
                this._renderComponent({
                    isOpen: false
                }, target);
                const element = document.querySelector(".sdl-dita-delivery-navigation-menu");
                expect(element.classList).not.toContain("open");
                expect(getComputedStyle(element).left).toBe("-500px");
                this._renderComponent({
                    isOpen: true
                }, target);
                expect(element.classList).toContain("open");
                // Animation takes .3s, use a slightly bigger timeout
                setTimeout((): void => {
                    expect(getComputedStyle(element).left).toBe("0px");
                    done();
                }, 310);
            });
        });
    }

    private _renderComponent(props: INavigationMenuProps, target: HTMLElement): void {
        ReactDOM.render(<NavigationMenu {...props}><div>Contents</div></NavigationMenu>, target);
    }
}

new NavigationMenuComponent().runTests();
