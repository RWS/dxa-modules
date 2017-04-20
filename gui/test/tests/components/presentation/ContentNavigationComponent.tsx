import * as React from "react";
import * as ReactDOM from "react-dom";
import { ContentNavigation, IContentNavigationItem, IContentNavigationProps } from "@sdl/dd/presentations/content-navigation";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "@sdl/models";

class ContentNavigationComponent extends TestBase {

    public runTests(): void {

        describe(`ContentNavigation component tests.`, (): void => {
            const target = super.createTargetElement();

            const navItems: IContentNavigationItem[] = [{
                id: "title_1",
                url: "/123/456/publication/Title-1",
                indention: 1,
                title: "Title-1"
            }, {
                id: "title_2",
                url: "/123/567/publication/Title-2",
                indention: 2,
                title: "Title-2"
            }];

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("renders content navigation panel", (): void => {
                this._renderComponent({
                    navItems: navItems
                }, target);
                const element = document.querySelector(".sdl-dita-delivery-content-navigation");
                expect(element).not.toBeNull();
                const hyperlinks = (element as HTMLElement).querySelectorAll("a");
                expect(hyperlinks.length).toBe(2);

                expect(hyperlinks.item(0).textContent).toBe(navItems[0].title);
                expect((hyperlinks.item(0).parentNode as HTMLElement).classList).toContain("indent-1");

                expect(hyperlinks.item(1).textContent).toBe(navItems[1].title);
                expect((hyperlinks.item(1).parentNode as HTMLElement).classList).toContain("indent-2");
            });
        });

    }

    private _renderComponent(props: IContentNavigationProps, target: HTMLElement): void {
        ReactDOM.render(<ComponentWithContext><ContentNavigation {...props} /></ComponentWithContext>, target);
    }
}

new ContentNavigationComponent().runTests();
