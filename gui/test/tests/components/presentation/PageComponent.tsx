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

            it("navigates to another page when internal hyperlink is clicked", (done: () => void): void => {
                const navUrl = "/1234/56/publication-title/page-title";
                const pageContent = `<div><a href="${navUrl}"/></div>`;
                const page = this._renderComponent({
                    showActivityIndicator: false,
                    content: pageContent,
                    onNavigate: (url: string): void => {
                        expect(url).toBe(navUrl);
                        done();
                    }
                }, target);

                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();
                const hyperlink = domNode.querySelector("a") as HTMLElement;
                hyperlink.click();
            });

            it("does not handle external links", (): void => {
                const pageProps = {
                    showActivityIndicator: false,
                    content: `<div>
                                <a href="http://doc.sdl.com"/>
                                <a href="doc.sdl.com"/>
                                <a href="~/doc.sdl.com"/>
                                <a href="/doc.sdl.com"/>
                                <a href="/12a34/5c"/>
                                <a href="/12/34/56/78/9"/>
                            </div>`,
                    onNavigate: (): void => {
                    }
                };
                const spy = spyOn(pageProps, "onNavigate").and.callThrough();
                const page = this._renderComponent(pageProps, target);

                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();

                const hyperlinks = domNode.querySelectorAll("a");
                expect(hyperlinks.length).toBe(6);

                for (let i: number = 0, length: number = hyperlinks.length; i < length; i++) {
                    const link = hyperlinks.item(i);
                    link.addEventListener("click", (e: Event): void => {
                        e.preventDefault();
                    });
                    link.click();
                }

                expect(spy).not.toHaveBeenCalled();
            });

            it("does handle internal links", (): void => {
                const pageProps = {
                    showActivityIndicator: false,
                    content: `<div>
                                <a href="/1656863/164363"/>
                                <a href="/1656863/164363/"/>
                                <a href="/1656863/164363/publication-mp330"/>
                                <a href="/1656863/164363/publication-mp330/"/>
                                <a href="/1656863/164363/publication-mp330/speed-dialling"/>
                            </div>`,
                    onNavigate: (): void => {
                    }
                };
                const spy = spyOn(pageProps, "onNavigate").and.callThrough();
                const page = this._renderComponent(pageProps, target);

                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();

                const hyperlinks = domNode.querySelectorAll("a");
                expect(hyperlinks.length).toBe(5);

                for (let i: number = 0, length: number = hyperlinks.length; i < length; i++) {
                    hyperlinks.item(i).click();
                }

                expect(spy).toHaveBeenCalledTimes(5);
            });

        });
    }

    private _renderComponent(props: IPageProps, target: HTMLElement): Page {
        return ReactDOM.render(<Page {...props} />, target) as Page;
    }
}

new PageComponent().runTests();
