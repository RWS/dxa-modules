/// <reference path="../../../src/components/App.tsx" />

module Sdl.DitaDelivery.Tests {

    import Page = Components.Page;
    import IPageProps = Components.IPageProps;

    class PageComponent extends SDL.Client.Test.TestBase {

        public runTests(): void {

            describe(`Page component tests.`, (): void => {
                const target = super.createTargetElement();

                afterEach(() => {
                    const domNode = ReactDOM.findDOMNode(target);
                    ReactDOM.unmountComponentAtNode(domNode);
                });

                afterAll(() => {
                    target.parentElement.removeChild(target);
                });

                it("shows / hides activity indicator", (): void => {
                    this._renderComponent({ showActivityIndicator: true }, target);
                    const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                    expect(domNode).not.toBeNull();
                    expect(domNode.querySelector(".sdl-activityindicator")).not.toBeNull("Could not find activity indicator.");
                    this._renderComponent({ showActivityIndicator: false }, target);
                    expect(domNode.querySelector(".sdl-activityindicator")).toBeNull("Activity indicator should have been removed.");
                });

                it("can show error info", (): void => {
                    this._renderComponent({ showActivityIndicator: false, error: "Error!" }, target);
                    const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                    expect(domNode).not.toBeNull();
                    const validationMessageNode = domNode.querySelector(".sdl-validationmessage");
                    expect(validationMessageNode).not.toBeNull("Could not find validation message.");
                    expect(validationMessageNode.textContent).toBe("Error!");
                });

                it("can show page content info", (): void => {
                    const pageContent = "<div>Page content!</div>";
                    this._renderComponent({
                        showActivityIndicator: false,
                        content: pageContent,
                        title: "Page title"
                    }, target);

                    const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                    expect(domNode).not.toBeNull();
                    const pageTitleNode = domNode.querySelector(".page-title") as HTMLElement;
                    expect(pageTitleNode).not.toBeNull("Could not find page title.");
                    expect(pageTitleNode.textContent).toBe("Page title");
                    const pageContentNode = domNode.querySelector(".page-content") as HTMLElement;
                    expect(pageContentNode).not.toBeNull("Could not find page content.");
                    expect(pageContentNode.children.length).toBe(1);
                    expect(pageContentNode.innerHTML).toBe(pageContent);
                });

            });

        }

        private _renderComponent(props: IPageProps, target: HTMLElement): void {
            ReactDOM.render(<Page {...props}/>, target);
        }
    }

    new PageComponent().runTests();
}
