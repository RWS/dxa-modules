import * as React from "react";
import * as ReactDOM from "react-dom";
import { NavigationMenu, INavigationMenuProps } from "@sdl/dd/presentation/NavigationMenu";
import { TestBase } from "@sdl/models";

import { RENDER_DELAY } from "test/Constants";

class NavigationMenuComponent extends TestBase {

    public runTests(): void {

        describe(`Navigation Menu tests`, (): void => {
            const target = super.createTargetElement();

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("renders", (): void => {
                this._renderComponent({
                    isOpen: false
                }, target);
                const element = document.querySelector(".sdl-dita-delivery-navigation-menu");
                expect(element).not.toBeNull();
                expect((element as HTMLElement).innerHTML).toBe("<div>Contents</div>");
            });

            it("can open/close", (done: () => void): void => {
                this._renderComponent({
                    isOpen: false
                }, target);
                const element = document.querySelector(".sdl-dita-delivery-navigation-menu") as HTMLElement;
                expect(element.classList).not.toContain("open");
                expect(getComputedStyle(element).left).toBe("-300px");
                this._renderComponent({
                    isOpen: true
                }, target);
                expect(element.classList).toContain("open");
                // Animation takes .3s, use a slightly bigger timeout
                setTimeout((): void => {
                    const left = getComputedStyle(element).left;
                    expect(left).not.toBeNull();
                    if (left) {
                        expect(parseInt(left, 10)).toBe(0);
                    }
                    done();
                }, RENDER_DELAY);
            });
        });
    }

    private _renderComponent(props: INavigationMenuProps, target: HTMLElement): void {
        ReactDOM.render(<NavigationMenu {...props}><div>Contents</div></NavigationMenu>, target);
    }
}

new NavigationMenuComponent().runTests();
