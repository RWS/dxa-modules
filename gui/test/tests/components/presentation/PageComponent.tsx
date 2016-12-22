import { Router, Route, hashHistory } from "react-router";
import { Page, IPageProps } from "components/presentation/Page";
import { Url } from "utils/Url";

// Global Catalina dependencies
import TestBase = SDL.Client.Test.TestBase;
import ActivityIndicator = SDL.ReactComponents.ActivityIndicator;
import ValidationMessage = SDL.ReactComponents.ValidationMessage;
const TestUtils = React.addons.TestUtils;

interface IProps {
    params: {
        pageAnchor?: string;
    };
}

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
                const pageProps: IPageProps = {
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
                const pageProps: IPageProps = {
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

            it("does not handle links that are not part of the page content", (): void => {
                const pageProps: IPageProps = {
                    showActivityIndicator: false,
                    content: `<div />`,
                    onNavigate: (): void => {
                    }
                };
                const spy = spyOn(pageProps, "onNavigate").and.callThrough();
                const page = this._renderComponent(pageProps, target, (<a href="/1656863/164363" onClick={(e): void => { e.preventDefault(); } } />));

                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();

                const hyperlinks = domNode.querySelectorAll("a");
                expect(hyperlinks.length).toBe(1);

                for (let i: number = 0, length: number = hyperlinks.length; i < length; i++) {
                    hyperlinks.item(i).click();
                }

                expect(spy).not.toHaveBeenCalled();
            });

            it("does not renders page navigation content, when page has no navigation items", (): void => {
                const pageProps: IPageProps = {
                    showActivityIndicator: false,
                    content: `<div />`,
                    onNavigate: (): void => {
                    }
                };
                const page = this._renderComponent(pageProps, target);

                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();

                const contentNavigationNode = domNode.querySelector(".sdl-dita-delivery-content-navigation") as HTMLElement;
                expect(contentNavigationNode.childNodes.length).toBe(0);
            });

        });

        describe(`Page navigation tests.`, (): void => {
            const target = super.createTargetElement();
            const pageUrl = Url.getPageUrl("123", "456", "publication", "page");
            let page: Page;

            beforeEach(() => {
                hashHistory.push(pageUrl);
                const margin = Array(100).join("<br/>");
                const pageProps: IPageProps = {
                    showActivityIndicator: false,
                    content: `<div>
                                <h1>header-1</h1>
                                ${margin}
                                <h2>header-2</h2>
                                ${margin}
                                <h3>header-3</h3>
                                ${margin}
                                <h4>header-4</h4>
                            </div>`,
                    url: pageUrl,
                    onNavigate: (): void => {
                    }
                };
                page = this._renderRoutedComponent(pageProps, target);
            });

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                target.parentElement.removeChild(target);
            });

            it("renders page navigation content", (): void => {
                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();

                const hyperlinks = domNode.querySelectorAll(".sdl-dita-delivery-content-navigation a") as NodeListOf<HTMLAnchorElement>;
                expect(hyperlinks.length).toBe(3);

                expect(hyperlinks.item(0).textContent).toBe("header-1");
                expect(hyperlinks.item(1).textContent).toBe("header-2");
                expect(hyperlinks.item(2).textContent).toBe("header-3");
            });

            it("scrolls to page content item", (done: () => void): void => {
                const spy = spyOn(window, "scrollTo").and.callThrough();

                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();

                const hyperlinks = domNode.querySelectorAll(".sdl-dita-delivery-content-navigation a") as NodeListOf<HTMLAnchorElement>;
                expect(hyperlinks.length).toBe(3);

                // We only need last item
                hyperlinks.item(2).click();

                setTimeout((): void => {
                    expect(spy).toHaveBeenCalledTimes(1);
                    // Scroll position is changed
                    expect(spy).not.toHaveBeenCalledWith(0, 0);
                    done();
                }, 100);
            });
        });

    }

    private _renderComponent(props: IPageProps, target: HTMLElement, children?: {}): Page {
        return ReactDOM.render(<Page {...props}>{children}</Page>, target) as Page;
    }

    private _renderRoutedComponent(props: IPageProps, target: HTMLElement, children?: {}): Page {
        return ReactDOM.render(
            <Router history={hashHistory}>
                <Route path=":publicationId(/:pageIdOrPublicationTitle)(/:publicationTitle)(/:pageTitle)(/:pageAnchor)"
                    component={(compProps: IProps) => (<Page anchor={compProps.params.pageAnchor} {...props}>{children}</Page>)} />
            </Router>, target) as Page;
    }
}

new PageComponent().runTests();
