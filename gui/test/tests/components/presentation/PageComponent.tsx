import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { Router, Route, browserHistory } from "react-router";
import { PagePresentation, IPageProps } from "@sdl/dd/Page/PagePresentation";
import { Url } from "utils/Url";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { ActivityIndicator } from "@sdl/controls-react-wrappers";
import { TestBase } from "@sdl/models";
import { configureStore } from "store/Store";
import { Provider } from "react-redux";
import { RouteToState } from "components/helpers/RouteToState";
import { Page } from "@sdl/dd/Page/Page";
import { PageService } from "test/mocks/services/PageService";
import { Html } from "utils/Html";
import { IWindow } from "interfaces/Window";

import { RENDER_DELAY, ASYNC_DELAY } from "test/Constants";

class PageComponent extends TestBase {
    public runTests(): void {
        describe(`Page component tests.`, (): void => {
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

            it("shows / hides activity indicator", (): void => {
                // Show
                let page = this._renderComponent(
                    {
                        isLoading: true,
                        onNavigate: (): void => {}
                    },
                    target
                );
                // tslint:disable-next-line:no-any
                const activityIndicator = TestUtils.findRenderedComponentWithType(page, ActivityIndicator as any);
                expect(activityIndicator).not.toBeNull("Could not find activity indicator.");

                // Hide
                page = this._renderComponent(
                    {
                        isLoading: false,
                        onNavigate: (): void => {}
                    },
                    target
                );
                // tslint:disable-next-line:no-any
                const activityIndicators = TestUtils.scryRenderedComponentsWithType(page, ActivityIndicator as any);
                expect(activityIndicators.length).toBe(0, "Activity indicator should have been removed.");
            });

            it("can show error info", (): void => {
                const page = this._renderComponent(
                    {
                        isLoading: false,
                        error: "Error!",
                        onNavigate: (): void => {}
                    },
                    target
                );
                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;

                const errorElement = domNode.querySelector(".sdl-dita-delivery-error") as HTMLElement;
                expect(errorElement).not.toBeNull("Error dialog not found");
                const errorTitle = errorElement.querySelector("h1") as HTMLElement;
                expect(errorTitle.textContent).toEqual("mock-error.default.title");
                const buttons = errorElement.querySelectorAll(".sdl-dita-delivery-button-group button") as NodeListOf<
                    HTMLButtonElement
                >;
                expect(buttons.length).toEqual(2);
            });

            it("click on home button in error info", (): void => {
                let path: string = "";
                const page = this._renderComponent(
                    {
                        isLoading: false,
                        error: "Error!",
                        onNavigate: (url: string): void => {
                            path = url;
                        }
                    },
                    target
                );

                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                const errorElement = domNode.querySelector(".sdl-dita-delivery-error") as HTMLElement;
                const buttons = errorElement.querySelectorAll(".sdl-dita-delivery-button-group button") as NodeListOf<
                    HTMLButtonElement
                >;
                expect(buttons.length).toEqual(2);

                buttons.item(0).click();
                setTimeout(() => {
                    expect(path).toBe("/");
                }, RENDER_DELAY);
            });

            it("click on retry button in error info", (): void => {
                const fetch = jasmine.createSpy("fetchSpy");
                const page = this._renderComponent(
                    {
                        id: "0002",
                        publicationId: "0001",
                        isLoading: false,
                        error: "Error!",
                        url: "url/to/page",
                        onNavigate: (url: string): void => {},
                        fetchPage: fetch
                    },
                    target
                );

                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                const errorElement = domNode.querySelector(".sdl-dita-delivery-error") as HTMLElement;
                const buttons = errorElement.querySelectorAll(".sdl-dita-delivery-button-group button") as NodeListOf<
                    HTMLButtonElement
                >;
                expect(buttons.length).toEqual(2);

                buttons.item(1).click();
                expect(fetch).toHaveBeenCalledWith(jasmine.any(PageService), "0001", "0002");
            });

            it("can show page content info", (): void => {
                const pageContent = "<div>Page content!</div>";
                const page = this._renderComponent(
                    {
                        isLoading: false,
                        content: pageContent,
                        onNavigate: (): void => {}
                    },
                    target
                );

                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();
                const pageContentNode = domNode.querySelector(".page-content") as HTMLElement;
                expect(pageContentNode).not.toBeNull("Could not find page content.");
                expect(pageContentNode.children.length).toBe(1);
                expect(pageContentNode.innerHTML).toBe(pageContent);
            });

            it("wide tables does not affect page content width", (done: () => void): void => {
                const tdsCount = 100;
                const page = this._renderComponent(
                    {
                        isLoading: false,
                        content: `<div class="tablenoborder"><table><tr>${Array(tdsCount)
                            .fill("LONG_TD_PLACEHOLDER")
                            .map(i => `<td>${i}</td>`)
                            .join("")}</tr></table></div>`,
                        onNavigate: (): void => {}
                    },
                    target
                );

                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();

                setTimeout((): void => {
                    const pageContentNode = domNode.querySelector(".page-content") as HTMLElement;
                    expect(pageContentNode).not.toBeNull("Could not find page content.");
                    const tableCells = pageContentNode.querySelectorAll(".tablenoborder td");
                    expect(tableCells.length).toBe(tdsCount);
                    expect(pageContentNode.scrollWidth).toBe(pageContentNode.offsetWidth);
                    done();
                }, RENDER_DELAY);
            });

            it("navigates to another page when internal hyperlink is clicked", (done: () => void): void => {
                const navUrl = "/1234/56/publication-title/page-title";
                const pageContent = `<div><a href="${navUrl}"/></div>`;
                const page = this._renderComponent(
                    {
                        isLoading: false,
                        content: pageContent,
                        onNavigate: (url: string): void => {
                            expect(url).toBe(navUrl);
                            done();
                        }
                    },
                    target
                );

                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();
                const hyperlink = domNode.querySelector("a") as HTMLElement;
                hyperlink.click();
            });

            it("does not handle external links", (): void => {
                const pageProps: IPageProps = {
                    isLoading: false,
                    content: `<div>
                                <a href="http://doc.sdl.com"/>
                                <a href="doc.sdl.com"/>
                                <a href="~/doc.sdl.com"/>
                                <a href="/doc.sdl.com"/>
                                <a href="/12a34/5c"/>
                                <a href="/12/3d4/56/78/9"/>
                            </div>`,
                    onNavigate: (): void => {}
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
                    isLoading: false,
                    content: `<div>
                                <a href="/1656863/164363"/>
                                <a href="/1656863/164363/"/>
                                <a href="/1656863/164363/publication-mp330"/>
                                <a href="/1656863/164363/publication-mp330/"/>
                                <a href="/1656863/164363/publication-mp330/speed-dialling"/>
                            </div>`,
                    onNavigate: (): void => {}
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
                    isLoading: false,
                    content: `<div />`,
                    onNavigate: (): void => {}
                };
                const spy = spyOn(pageProps, "onNavigate").and.callThrough();
                const page = this._renderComponent(
                    pageProps,
                    target,
                    <a
                        href="/1656863/164363"
                        onClick={(e): void => {
                            e.preventDefault();
                        }}
                    />
                );

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
                    isLoading: false,
                    content: `<div />`,
                    onNavigate: (): void => {}
                };
                const page = this._renderComponent(pageProps, target);

                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();

                const contentNavigationNode = domNode.querySelector(
                    ".sdl-dita-delivery-content-navigation"
                ) as HTMLElement;
                expect(contentNavigationNode).toBeNull();
            });

            it("highlights code blocks in page content", (done: () => void): void => {
                const pageProps: IPageProps = {
                    isLoading: false,
                    content: `<div>
                                <pre class="codeblock">
                                    <code class="language-js">
                                        console.log("Test works");
                                    </code>
                                </pre>
                            </div>`,
                    onNavigate: (): void => {}
                };

                const page = this._renderComponent(pageProps, target);
                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();

                setTimeout((): void => {
                    const logFunctionNode = domNode.querySelector(
                        ".page-content .codeblock code.language-js span.function"
                    ) as HTMLElement;
                    expect(logFunctionNode && logFunctionNode.textContent).toBe("log", "Styling are not applied");
                    done();
                }, RENDER_DELAY);
            });

            it("does not highlights code blocks in page if there are any html tags", (done: () => void): void => {
                const pageProps: IPageProps = {
                    isLoading: false,
                    content: `<div>
                                <pre class="pre codeblock">
                                    <code>
                                        This is the codeblock, &lt;var class="keyword varname"&gt;This is the varname,&lt;/var&gt; the end
                                    </code>
                                </pre>
                                <pre class="pre codeblock">
                                    <code>
                                        This is the codeblock, <var class="keyword varname">This is the varname,</var> the end<
                                    /code>
                                </pre>
                            </div>`,
                    onNavigate: (): void => {}
                };

                const page = this._renderComponent(pageProps, target);
                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();

                setTimeout((): void => {
                    const codeBlocks = domNode.querySelectorAll(".page-content .codeblock code") as NodeListOf<HTMLElement>;
                    expect(codeBlocks.length).toBe(2);
                    expect(codeBlocks[0].querySelectorAll("span.tag").length).toBeGreaterThan(0, "Styling should be applied");
                    expect(codeBlocks[1].querySelectorAll("span.tag").length).toBe(0, "Styling should not be applied");
                    done();
                }, RENDER_DELAY);
            });

            it("can open big images in lightbox", (done: () => void): void => {
                const pageProps: IPageProps = {
                    isLoading: false,
                    content: `<div style="width: 500px">
                                <img id="img-10x1"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAABCAQAAABN/Pf1AAAADUlEQVR42mNk+M+AAQATFwEB/YopsAAAAABJRU5ErkJggg=="
                                />
                                <br/>
                                <img id="img-1000x1" style="width: 100px"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAABCAYAAABNAIQzAAAAHklEQVR42u3CQREAAAgDoNk/tLOFHzhmkwsAAAB8Kj7WAgBDnCYvAAAAAElFTkSuQmCC"
                                />
                            </div>`,
                    onNavigate: (): void => {}
                };

                const page = this._renderComponent(pageProps, target);
                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();

                setTimeout((): void => {
                    expect((domNode.querySelector("#img-10x1") as HTMLImageElement).classList).not.toContain(
                        "sdl-expandable-image",
                        "Small images should not be expandable"
                    );
                    // Opens image in lightbox on click
                    const imageInLightbox = domNode.querySelector("#img-1000x1") as HTMLImageElement;
                    expect(imageInLightbox.classList).toContain(
                        "sdl-expandable-image",
                        "Big images should be expandable"
                    );
                    imageInLightbox.click();

                    setTimeout((): void => {
                        const previwImage = domNode.querySelector(
                            ".sdl-image-lightbox-preview-wrapper img"
                        ) as HTMLImageElement;
                        expect(previwImage.src).toBe(imageInLightbox.src);
                        // It closes on image click
                        previwImage.click();
                        setTimeout((): void => {
                            expect(domNode.querySelector(".sdl-image-lightbox-preview-wrapper")).toBeNull();
                            if (imageInLightbox.parentElement) {
                                imageInLightbox.style.width =
                                imageInLightbox.parentElement.style.width = "1000px";
                            }
                            page.forceUpdate();
                            setTimeout((): void => {
                                expect(
                                    (domNode.querySelector("#img-1000x1") as HTMLImageElement).classList
                                ).not.toContain(
                                    "sdl-expandable-image",
                                    "If screen in big enought to fix big image, it should not be expandable"
                                );
                                done();
                            }, RENDER_DELAY);
                        }, RENDER_DELAY);
                    }, RENDER_DELAY);
                }, ASYNC_DELAY);
            });

            it("Reducing size of big images should allow to open them in lightbox", (done: () => void): void => {
                const pageProps: IPageProps = {
                    isLoading: false,
                    content: `<div style="width: 500px">
                                <img id="img-10x1"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAABCAQAAABN/Pf1AAAADUlEQVR42mNk+M+AAQATFwEB/YopsAAAAABJRU5ErkJggg=="
                                />
                                <br/>
                                <img id="img-1000x1" style="width: 400px"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAABCAYAAABNAIQzAAAAHklEQVR42u3CQREAAAgDoNk/tLOFHzhmkwsAAAB8Kj7WAgBDnCYvAAAAAElFTkSuQmCC"
                                />                            
                            </div>`,
                    onNavigate: (): void => {}
                };

                const page = this._renderComponent(pageProps, target);
                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();

                setTimeout((): void => {
                    let smallImageNotExpandable = domNode.querySelector("#img-10x1") as HTMLImageElement;
                    expect((smallImageNotExpandable).classList).not.toContain(
                        "sdl-expandable-image",
                        "Small images should not be expandable"
                    );
                    const imageInLightbox = domNode.querySelector("#img-1000x1") as HTMLImageElement;
                    expect(imageInLightbox.classList).not.toContain(
                        "sdl-expandable-image",
                        "Big images should be expandable"
                    );
                    window.resizeTo(100, 100);

                    setTimeout((): void => {
                        expect(domNode.querySelector(".sdl-image-lightbox-preview-wrapper")).toBeNull();

                        setTimeout((): void => {
                            expect(
                                (domNode.querySelector("#img-1000x1") as HTMLImageElement).classList
                            ).toContain(
                                "sdl-expandable-image",
                                "Screen is not big enough to fit big image, it should be expandable"
                            );
                            window.resizeTo(500, 500);
                            setTimeout((): void => {
                                expect(
                                    (domNode.querySelector("#img-1000x1") as HTMLImageElement).classList
                                ).not.toContain(
                                    "sdl-expandable-image",
                                    "Screen is not big enough to fit big image, it should be expandable"
                                );
                                done();
                            }, RENDER_DELAY);
                        }, RENDER_DELAY);
                    }, RENDER_DELAY);
                }, ASYNC_DELAY);
            });

            it("opens image in new tab if it can be opened in lightbox", (done: () => void): void => {
                const imgTitle = "img-10000x1";
                const img10000x1 =
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAJxAAAAABCA" +
                    "YAAAB43rQLAAAAQ0lEQVR42u3BAQ0AAAQAMLKooZ/YbHL8z5reAAAAAAA" +
                    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3gFLLQHn34E1CgAAAABJRU5ErkJggg==";

                const pageProps: IPageProps = {
                    isLoading: false,
                    content: `<div style="width: 95%; height: 100%; overflow: hidden;">
                            <img style="width: 100%;" id="img-10000x1" title="${imgTitle}" src="${img10000x1}"/>
                        </div>`,
                    onNavigate: (): void => {}
                };

                const page = this._renderComponent(pageProps, target);
                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();

                setTimeout((): void => {
                    // Opens image in new window
                    const imageInLightbox = domNode.querySelector("img") as HTMLImageElement;
                    expect(imageInLightbox.classList).toContain("sdl-expandable-image");

                    spyOn(window, "open").and.callFake((url: string, title: string): void => {
                        // Check if routing was called with correct params
                        expect(title).toBe(imgTitle);
                        done();
                    });

                    imageInLightbox.click();
                }, ASYNC_DELAY);
            });
        });

        describe(`Page navigation tests.`, (): void => {
            const target = super.createTargetElement();
            const pageUrl = Url.getPageUrl("123", "456", "publication", "page");
            let page: PagePresentation;

            beforeEach(() => {
                browserHistory.push(pageUrl);
                const margin = Array(100).join("<br/>");
                const pageProps: IPageProps = {
                    isLoading: false,
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
                    onNavigate: (): void => {}
                };
                page = this._renderRoutedComponent(pageProps, target);
            });

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("renders page navigation content", (): void => {
                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();

                const hyperlinks = domNode.querySelectorAll(".sdl-dita-delivery-content-navigation a") as NodeListOf<
                    HTMLAnchorElement
                >;
                expect(hyperlinks.length).toBe(2);

                expect(hyperlinks.item(0).textContent).toBe("header-2");
                expect(hyperlinks.item(1).textContent).toBe("header-3");
            });

            it("scrolls to page content item", (done: () => void): void => {
                const spy = spyOn(Html, "scrollIntoView").and.callThrough();

                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();

                const hyperlinks = domNode.querySelectorAll(".sdl-dita-delivery-content-navigation a") as NodeListOf<
                    HTMLAnchorElement
                >;
                expect(hyperlinks.length).toBe(2);

                // We only need last item
                hyperlinks.item(1).click();

                setTimeout((): void => {
                    expect(spy).toHaveBeenCalledTimes(1);
                    // Scroll position is changed
                    expect(spy).not.toHaveBeenCalledWith(0, 0);
                    done();
                }, 100 + RENDER_DELAY);
            });

            it("scrolls to same content item", (done: () => void): void => {
                const spy = spyOn(Html, "scrollIntoView").and.callThrough();
                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();

                const hyperlinks = domNode.querySelectorAll(".sdl-dita-delivery-content-navigation a") as NodeListOf<
                    HTMLAnchorElement
                >;
                expect(hyperlinks.length).toBe(2);

                // We only need last item
                hyperlinks.item(1).click();
                window.scrollTo(0, 0);
                hyperlinks.item(1).click();

                setTimeout((): void => {
                    expect(spy).toHaveBeenCalledTimes(1);
                    done();
                }, 100 + RENDER_DELAY);
            });

            it("scrolls when page title is not specified", (done: () => void): void => {
                const spy = spyOn(Html, "scrollIntoView").and.callThrough();

                const pageUrlWithNoTitle = Url.getPageUrl("123", "456", "publication");
                browserHistory.push(pageUrlWithNoTitle);

                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                expect(domNode).not.toBeNull();

                const hyperlinks = domNode.querySelectorAll(".sdl-dita-delivery-content-navigation a") as NodeListOf<
                    HTMLAnchorElement
                >;
                expect(hyperlinks.length).toBe(2);

                // We only need last item
                hyperlinks.item(1).click();
                setTimeout((): void => {
                    expect(spy).toHaveBeenCalledTimes(1);
                    done();
                }, 100 + RENDER_DELAY);
            });
        });

        describe(`Page content evaluation tests.`, (): void => {
            const target = super.createTargetElement();

            const win = window as IWindow;
            const isEvaluableFlag = win.SdlDitaDeliveryContentIsEvaluable;
            const consoleMessage = "RUN";

            const defaultProps = {
                isLoading: false,
                content: `
                <div>
                    <script xmlns="http://www.w3.org/1999/xhtml" type="text/javascript">
                        console.info("${consoleMessage}");
                    </script>
                </div>`,
                onNavigate: (): void => {}
            };

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }

                win.SdlDitaDeliveryMocksEnabled = isEvaluableFlag;
            });

            it("evaluates page content scripts when evluable flag is enabled", (done: () => void): void => {
                win.SdlDitaDeliveryContentIsEvaluable = true;
                const spy = spyOn(console, "info");
                const page = this._renderComponent(defaultProps, target);

                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                setTimeout((): void => {
                    expect(win.SdlDitaDeliveryContentIsEvaluable).toBeTruthy();

                    const pageContentNode = domNode.querySelector(".page-content") as HTMLElement;
                    expect(pageContentNode.innerHTML).toBe(defaultProps.content);
                    expect(spy).toHaveBeenCalledWith(consoleMessage);
                    done();
                }, RENDER_DELAY);
            });

            it("does not evaluates page content scripts when evluable flag is disabled", (done: () => void): void => {
                win.SdlDitaDeliveryContentIsEvaluable = false;
                const spy = spyOn(console, "info");
                const page = this._renderComponent(defaultProps, target);

                const domNode = ReactDOM.findDOMNode(page) as HTMLElement;
                setTimeout((): void => {
                    expect(win.SdlDitaDeliveryContentIsEvaluable).toBeFalsy();

                    const pageContentNode = domNode.querySelector(".page-content") as HTMLElement;
                    expect(pageContentNode.innerHTML).toBe(defaultProps.content);
                    expect(spy).not.toHaveBeenCalled();
                    done();
                }, RENDER_DELAY);
            });
        });
    }

    private _renderComponent(props: IPageProps, target: HTMLElement, children?: {}): PagePresentation {
        const store = configureStore();

        const comp = ReactDOM.render(
            <Provider store={store}>
                <ComponentWithContext>
                    <PagePresentation {...props}>{children}</PagePresentation>
                </ComponentWithContext>
            </Provider>,
            target
        ) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(comp, PagePresentation) as PagePresentation;
    }

    private _renderRoutedComponent(props: IPageProps, target: HTMLElement, children?: {}): PagePresentation {
        const store = configureStore();

        const comp = ReactDOM.render(
            <Router history={browserHistory}>
                <Route
                    path=":publicationId(/:pageIdOrPublicationTitle)(/:publicationTitle)(/:pageTitle)(/:pageAnchor)"
                    component={() => (
                        <Provider store={store}>
                            <ComponentWithContext>
                                <RouteToState />
                                <Page {...props}>{children}</Page>
                            </ComponentWithContext>
                        </Provider>
                    )}
                />
            </Router>,
            target
        ) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(comp, PagePresentation) as PagePresentation;
    }
}

new PageComponent().runTests();
