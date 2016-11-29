import { Page, IPageProps } from "components/presentation/Page";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;
import ActivityIndicator = SDL.ReactComponents.ActivityIndicator;
import ValidationMessage = SDL.ReactComponents.ValidationMessage;
const TestUtils = React.addons.TestUtils;

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
                // Show
                let page = this._renderComponent({
                    showActivityIndicator: true,
                    onNavigate: (): void => { }
                }, target);
                // tslint:disable-next-line:no-any
                const activityIndicator = TestUtils.findRenderedComponentWithType(page, ActivityIndicator as any);
                expect(activityIndicator).not.toBeNull("Could not find activity indicator.");

                // Hide
                page = this._renderComponent({
                    showActivityIndicator: false,
                    onNavigate: (): void => { }
                }, target);
                // tslint:disable-next-line:no-any
                const activityIndicators = TestUtils.scryRenderedComponentsWithType(page, ActivityIndicator as any);
                expect(activityIndicators.length).toBe(0, "Activity indicator should have been removed.");
            });

            it("can show error info", (): void => {
                const page = this._renderComponent({
                    showActivityIndicator: false,
                    error: "Error!",
                    onNavigate: (): void => { }
                }, target);

                // tslint:disable-next-line:no-any
                const validationMessage = TestUtils.findRenderedComponentWithType(page, ValidationMessage as any);
                expect(validationMessage).not.toBeNull("Could not find validation message.");
                const validationMessageNode = ReactDOM.findDOMNode(validationMessage);
                expect(validationMessageNode.textContent).toBe("Error!");
            });

            it("can show page content info", (): void => {
                const pageContent = "<div>Page content!</div>";
                const page = this._renderComponent({
                    showActivityIndicator: false,
                    content: pageContent,
                    onNavigate: (): void => { }
                }, target);

                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();
                const pageContentNode = domNode.querySelector(".page-content") as HTMLElement;
                expect(pageContentNode).not.toBeNull("Could not find page content.");
                expect(pageContentNode.children.length).toBe(1);
                expect(pageContentNode.innerHTML).toBe(pageContent);
            });

            it("navigates to another page when a hyperlink is clicked", (done: () => void): void => {
                const pageContent = "<div><a href=\"ish:12-34-56\"/></div>";
                const page = this._renderComponent({
                    showActivityIndicator: false,
                    content: pageContent,
                    onNavigate: (pageId: string): void => {
                        expect(pageId).toBe("ish:12-34-56");
                        done();
                    }
                }, target);

                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();
                const hyperlink = domNode.querySelector("a") as HTMLElement;
                hyperlink.click();
            });

        });

    }

    private _renderComponent(props: IPageProps, target: HTMLElement): Page {
        return ReactDOM.render(<Page {...props} />, target) as Page;
    }
}

new PageComponent().runTests();
