import * as React from "react";
import * as ReactDOM from "react-dom";
import { ContentNavigation, IContentNavigationItem, IContentNavigationProps } from "components/presentation/ContentNavigation";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;

class ContentNavigationComponent extends TestBase {

    public runTests(): void {

        describe(`ContentNavigation component tests.`, (): void => {
            const target = super.createTargetElement();

            const navItems: IContentNavigationItem[] = [{
                id: "title_1",
                url: "/123/456/publication/Title-1",
                title: "Title-1"
            }, {
                id: "title_2",
                url: "/123/567/publication/Title-2",
                title: "Title-2"
            }];

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                target.parentElement.removeChild(target);
            });

            it("renders content navigation panel", (): void => {
                this._renderComponent({
                    navItems: navItems
                }, target);
                const element = document.querySelector(".sdl-dita-delivery-content-navigation");
                expect(element).not.toBeNull();
                const hyperlinks = element.querySelectorAll("a");
                expect(hyperlinks.length).toBe(2);

                expect(hyperlinks.item(0).textContent).toBe(navItems[0].title);
                expect(hyperlinks.item(1).textContent).toBe(navItems[1].title);
            });
        });

    }

    private _renderComponent(props: IContentNavigationProps, target: HTMLElement): void {
        ReactDOM.render(<ComponentWithContext><ContentNavigation {...props} /></ComponentWithContext>, target);
    }
}

new ContentNavigationComponent().runTests();
