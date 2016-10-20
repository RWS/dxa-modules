import { Page, IPageProps } from "../../../../src/components/presentation/Page";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;

class PageComponent extends TestBase {

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
                this._renderComponent({
                    showActivityIndicator: true,
                    onNavigate: (): void => { }
                }, target);
                const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                expect(domNode).not.toBeNull();
                expect(domNode.querySelector(".sdl-activityindicator")).not.toBeNull("Could not find activity indicator.");
                this._renderComponent({
                    showActivityIndicator: false,
                    onNavigate: (): void => { }
                }, target);
                expect(domNode.querySelector(".sdl-activityindicator")).toBeNull("Activity indicator should have been removed.");
            });

            it("can show error info", (): void => {
                this._renderComponent({
                    showActivityIndicator: false,
                    error: "Error!",
                    onNavigate: (): void => { }
                }, target);
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
                    onNavigate: (): void => { }
                }, target);

                const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                expect(domNode).not.toBeNull();
                const pageContentNode = domNode.querySelector(".page-content") as HTMLElement;
                expect(pageContentNode).not.toBeNull("Could not find page content.");
                expect(pageContentNode.children.length).toBe(1);
                expect(pageContentNode.innerHTML).toBe(pageContent);
            });

            it("navigates to another page when a hyperlink is clicked", (done: () => void): void => {
                const pageContent = "<div><a href=\"ish:123456\"/></div>";
                this._renderComponent({
                    showActivityIndicator: false,
                    content: pageContent,
                    onNavigate: (pageId: string): void => {
                        expect(pageId).toBe("ish:123456");
                        done();
                    }
                }, target);

                const domNode = ReactDOM.findDOMNode(target) as HTMLElement;
                expect(domNode).not.toBeNull();
                const hyperlink = domNode.querySelector(".page-content a") as HTMLElement;
                hyperlink.click();
            });

        });

    }

    private _renderComponent(props: IPageProps, target: HTMLElement): void {
        ReactDOM.render(<Page {...props} />, target);
    }
}

new PageComponent().runTests();
