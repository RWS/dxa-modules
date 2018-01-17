import * as ClassNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Prism from "prismjs";
import * as PropTypes from "prop-types";

import { browserHistory } from "react-router";
import { ActivityIndicator, Button } from "@sdl/controls-react-wrappers";
import { ButtonPurpose } from "@sdl/controls";
import { Html, IHeader } from "utils/Html";
import { Url } from "utils/Url";
import { path } from "utils/Path";
import { ContentNavigation, IContentNavigationItem } from "@sdl/dd/presentation/ContentNavigation";
import { Error } from "@sdl/dd/presentation/Error";
import { CommentsSection } from "@sdl/dd/CommentsSection/CommentsSection";
import { IAppContext } from "@sdl/dd/container/App/App";
import { IPageService } from "services/interfaces/PageService";

import "components/controls/styles/ActivityIndicator";
import "components/controls/styles/Button";
import "dita-ot/styles/commonltr";
import "dita-ot/styles/commonrtl";
import "prismjs/themes/prism";

import "./Page.less";

import { IWindow } from "interfaces/Window";

const commentingIsEnabled: boolean = (window as IWindow).SdlDitaDeliveryCommentingIsEnabled || false;

/**
 * Page component props
 *
 * @export
 * @interface IPageProps
 */
export interface IPageProps {
    /**
     * Page is loading
     *
     * @type {boolean}
     * @memberOf IPageProps
     */
    isLoading: boolean;

    /**
     * Page id
     * @type {string}
     * @memberOf IPageProps
     */
    id?: string;

    /**
     * publicationId
     * @type {string}
     * @memberOf IPageProps
     */
    publicationId?: string;

    /**
     * Page content
     *
     * @type {string | null}
     * @memberOf IPageProps
     */
    content?: string | null;
    /**
     * An error prevented the page from rendering
     *
     * @type {string | null}
     */
    error?: string | null;
    /**
     * Url of the page
     *
     * @type {string}
     * @memberOf IPageProps
     */
    url?: string;
    /**
     * Anchor which is active.
     * Used for navigating to a specific section in the page.
     *
     * @type {string}
     * @memberOf IPageProps
     */
    anchor?: string;
    /**
     * Header which is active.
     * The header inside the page which is the first one visible in the view port.
     *
     * @type {IHeader}
     * @memberOf IPageProps
     */
    activeHeader?: IHeader;
    /**
     * UI language
     *
     * @type {string}
     * @memberOf IPageProps
     */
    direction?: string;
    /**
     * Called whenever navigation to another page is requested
     *
     * @param {string}
     * @memberOf IPageProps
     */
    onNavigate(url: string): void;

    fetchPage?(pageService: IPageService, publicationId: string, pageId: string): void;
}

/**
 * Page component state
 *
 * @export
 * @interface IPageState
 */
export interface IPageState {
    /**
     * Items used in content Navigation
     *
     * @type {IContentNavigationItem[]}
     * @memberOf IPageState
     */
    navItems: IContentNavigationItem[];

    /**
     * Image to display
     *
     * @type {string}
     * @memberOf IPageState
     */
    dialogImageSrc: string | null;
}

/**
 * Page component
 */
export class PagePresentation extends React.Component<IPageProps, IPageState> {
    /**
     * Context types
     *
     * @static
     * @type {React.ValidationMap<IAppContext>}
     */
    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: PropTypes.object.isRequired
    };

    /**
     * Global context
     *
     * @type {IAppContext}
     */
    public context: IAppContext;

    private _hyperlinks: { element: HTMLElement; clickHandler: (e: Event) => void }[] = [];
    private _scripts: HTMLElement[] = [];
    private _codeBlocks: HTMLElement[] = [];
    private _contentImages: { element: HTMLImageElement; clickHandler: (e: Event) => void }[] = [];

    private _lastPageAnchor?: string;
    private _historyUnlisten: () => void;

    /**
     * Creates an instance of Page.
     */
    constructor() {
        super();
        this.state = {
            navItems: [],
            dialogImageSrc: null
        };

        this.fetchPage = this.fetchPage.bind(this);
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {
        if (browserHistory) {
            this._historyUnlisten = browserHistory.listen(() => {
                this._lastPageAnchor = undefined;
            });
        }
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const props = this.props;
        const { activeHeader, error, direction, id } = props;
        const { navItems, dialogImageSrc } = this.state;
        const { formatMessage } = this.context.services.localizationService;
        const activeNavItemId = activeHeader ? activeHeader.id : navItems.length > 0 ? navItems[0].id : undefined;
        const _goHome = (): void => props.onNavigate(path.getRootPath());
        const errorButtons = (
            <div>
                {/* Need to replace this button with PageLink then we don't need to pass onNaviate */}
                <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{ click: _goHome }}>
                    {formatMessage("components.breadcrumbs.home")}
                </Button>
                <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{ click: () => this.fetchPage() }}>
                    {formatMessage("control.button.retry")}
                </Button>
            </div>
        );
        const errorTitle = formatMessage("error.default.title");
        const errorMessages = [formatMessage("error.page.not.found"), formatMessage("error.default.message")];
        const showCommentsComponents = commentingIsEnabled && (!error && id);

        const appClass = ClassNames(direction, "page-content");

        return (
            <div className={"sdl-dita-delivery-page"} style={props.isLoading ? { overflow: "hidden" } : {}}>
                {navItems.length > 0 && (
                    <div className={"sdl-dita-delivery-content-navigation-wrapper"}>
                        <ContentNavigation navItems={navItems} activeNavItemId={activeNavItemId} />
                    </div>
                )}
                <div className={"sdl-dita-delivery-page-content"}>
                    {props.isLoading ? (
                        <ActivityIndicator skin="graphene" text={formatMessage("components.app.loading")} />
                    ) : null}
                    {props.children}
                    {error ? (
                        <Error title={errorTitle} messages={errorMessages} buttons={errorButtons} />
                    ) : (
                        <article
                            className={appClass}
                            dangerouslySetInnerHTML={{
                                __html: props.content || formatMessage("components.page.nothing.selected")
                            }}
                        />
                    )}
                    {showCommentsComponents && <CommentsSection />}
                </div>
                {dialogImageSrc !== null && (
                    <div
                        className="sdl-image-lightbox-preview-wrapper"
                        onClick={() => this.setState({ dialogImageSrc: null })}>
                        <img src={dialogImageSrc} />
                    </div>
                )}
            </div>
        );
    }

    /**
     * Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
     */
    public componentDidMount(): void {
        this._postProcessHtml();
    }

    /**
     * Invoked immediately after the component's updates are flushed to the DOM. This method is not called for the initial render.
     */
    public componentDidUpdate(): void {
        this._postProcessHtml();
        this._jumpToAnchor();
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount(): void {
        this._disableHyperlinks();

        if (this._historyUnlisten) {
            this._historyUnlisten();
        }
    }

    private fetchPage(): void {
        const { fetchPage, publicationId, id = "" } = this.props;
        if (fetchPage && publicationId) {
            fetchPage(this.context.services.pageService, publicationId, id);
        }
    }

    /**
     * Post process HTML
     *
     * @private
     *
     * @memberOf Page
     */
    private _postProcessHtml(): void {
        const domNode = ReactDOM.findDOMNode(this);
        const pageContentNode = domNode.querySelector(".page-content") as HTMLElement;
        this._collectHeadersLinks(pageContentNode);
        if (pageContentNode) {
            //Highlight code blocks
            this._highlightCodeBlocks(pageContentNode);

            // Make hyperlinks navigate when clicked
            this._processContentLinks(pageContentNode);

            // Make images expandable when clicked
            this._processContentImages(pageContentNode);

            // If script evaluable option is enabled, we have to evaluate all the scripts inserted in app
            if ((window as IWindow).SdlDitaDeliveryContentIsEvaluable) {
                this._evaluateContentScripts(pageContentNode);
            }
        }
    }

    /**
     * Highlight сode blocks if there are any.
     */
    private _highlightCodeBlocks(pageContentNode: HTMLElement): void {
        const codeBlocks = this._codeBlocks;
        const highlightBlocks = pageContentNode.querySelectorAll("pre.codeblock code");
        for (let i: number = 0, length: number = highlightBlocks.length; i < length; i++) {
            const block = highlightBlocks.item(i) as HTMLElement;
            const isAdded = codeBlocks.indexOf(block) > -1;
            if (!isAdded) {
                const pre = block && (block.parentElement as HTMLPreElement);
                if (!pre.classList.contains("language-markup")) {
                    pre.classList.add("language-markup");
                }
                codeBlocks.push(block);
                if (block.childElementCount === 0) {
                    Prism.highlightElement(block, false);
                }
            }
        }
    }

    /**
     * Make hyperlinks navigate when clicked
     */
    private _processContentLinks(pageContentNode: HTMLElement): void {
        const props = this.props;
        const anchors = pageContentNode.querySelectorAll("a");
        const hyperlinks = this._hyperlinks;
        for (let i: number = 0, length: number = anchors.length; i < length; i++) {
            const anchor = anchors.item(i) as HTMLAnchorElement;
            const alreadyAdded = hyperlinks.filter(hyperlink => hyperlink.element === anchor).length === 1;
            if (!alreadyAdded) {
                const itemUrl = anchor.getAttribute("href");
                if (Url.itemUrlIsValid(itemUrl)) {
                    const clickHandler = (e: Event): void => {
                        if (itemUrl) {
                            props.onNavigate(itemUrl);
                        }
                        e.preventDefault();
                    };
                    hyperlinks.push({
                        element: anchor,
                        clickHandler
                    });
                    anchor.addEventListener("click", clickHandler);
                }
            }
        }
    }

    /**
     * Make images expandable to the full screen
     */
    private _processContentImages(pageContentNode: HTMLElement): void {
        const images = pageContentNode.querySelectorAll("img") as NodeListOf<HTMLImageElement>;
        const processedImages = this._contentImages;

        for (let i: number = 0, length: number = images.length; i < length; i++) {
            new Promise((resolve: (img: HTMLImageElement) => void) => {
                const img = images.item(i);
                if (img.complete) {
                    resolve(img);
                } else {
                    img.onload = () => {
                        resolve(img);
                    };
                }
            }).then((img: HTMLImageElement) => {
                const dialogImageSrc = img.src;
                const { clientWidth, naturalWidth, clientHeight, naturalHeight } = img;
                const isImageToProcess = clientWidth < naturalWidth || clientHeight < naturalHeight;
                const alreadyProcessedImg = processedImages.find(x => x.element === img);
                if (isImageToProcess && !alreadyProcessedImg && !img.getAttribute("width")) {
                    const clickHandler = (e: Event): void => {
                        if (dialogImageSrc) {
                            // If there is at least 30% of space to expand an imag, then expand it in lightbox
                            if (document.documentElement.clientWidth > img.clientWidth * 1.3) {
                                this.setState({
                                    dialogImageSrc
                                });
                            } else {
                                window.open(dialogImageSrc, img.title);
                            }
                        }
                        e.preventDefault();
                    };
                    processedImages.push({
                        element: img,
                        clickHandler
                    });
                    img.addEventListener("click", clickHandler);
                    if (!img.classList.contains("sdl-expandable-image")) {
                        img.classList.add("sdl-expandable-image");
                    }
                } else if (!alreadyProcessedImg && img.getAttribute("width")) {
                    img.setAttribute("max-width", "unset");
                    if (img.parentElement) {
                        img.parentElement.style.setProperty("overflow-x", "auto");
                    }
                } else if (!isImageToProcess && alreadyProcessedImg) {
                    const el = alreadyProcessedImg.element;
                    if (el.classList.contains("sdl-expandable-image")) {
                        el.classList.remove("sdl-expandable-image");
                    }
                    el.removeEventListener("click", alreadyProcessedImg.clickHandler);
                    processedImages.splice(processedImages.indexOf(alreadyProcessedImg), 1);
                }
            });
        }
    }
    /**
     * Evaluate code inside page content if there are any.
     */
    private _evaluateContentScripts(pageContentNode: HTMLElement): void {
        const scripts = this._scripts;
        // Make hyperlinks navigate when clicked
        const pageScripts = pageContentNode.querySelectorAll("script");
        for (let i: number = 0, length: number = pageScripts.length; i < length; i++) {
            const script = pageScripts.item(i) as HTMLElement;
            if (!scripts.includes(script)) {
                const parentNode = script.parentNode;
                if (parentNode) {
                    const newScriptNode = document.createElement("script");
                    if (script.hasAttributes()) {
                        for (
                            let attrI: number = 0,
                                attributes = script.attributes,
                                attrLength: number = attributes.length;
                            attrI < attrLength;
                            attrI++
                        ) {
                            const attribute = attributes.item(attrI);
                            const { name, localName, namespaceURI } = attribute;
                            if (namespaceURI) {
                                newScriptNode.setAttributeNodeNS(script
                                    .getAttributeNodeNS(namespaceURI, localName || name)
                                    .cloneNode(true) as Attr);
                            } else {
                                newScriptNode.setAttributeNode(script.getAttributeNode(name).cloneNode(true) as Attr);
                            }
                        }
                    }

                    if (script.innerHTML) {
                        newScriptNode.innerHTML = script.innerHTML;
                    }

                    scripts.push(newScriptNode);
                    parentNode.replaceChild(newScriptNode, script);
                }
            }
        }
    }

    /**
     * Collects headers links
     */
    private _collectHeadersLinks(pageContentNode: HTMLElement): void {
        const { navItems } = this.state;
        let updatedItems: IContentNavigationItem[] = [];
        if (pageContentNode) {
            const { url } = this.props;
            updatedItems = Html.getHeaderLinks(pageContentNode)
                .filter(
                    (item: IHeader) => item.importancy == 2 || item.importancy == 3 // We only need level 2 and 3 for items rendered in conten navigation
                )
                .map(item => ({
                    id: item.id,
                    title: item.title,
                    indention: Number(item.importancy == 3),
                    url: url ? Url.getAnchorUrl(url, item.id) : "#" + item.id
                }));
        }
        if (
            navItems.length != updatedItems.length ||
            !navItems.every((item, index) => (item && item.id) == (updatedItems[index] && updatedItems[index].id))
        ) {
            this.setState({
                navItems: updatedItems
            });
        }
    }

    /**
     * Make hyperlinks navigation disabled
     */
    private _disableHyperlinks(): void {
        this._hyperlinks.forEach(anchor => {
            anchor.element.removeEventListener("click", anchor.clickHandler);
        });

        this._contentImages.forEach(img => {
            img.element.removeEventListener("click", img.clickHandler);
        });
    }

    /**
     * Jump to an anchor in the page
     */
    private _jumpToAnchor(): void {
        const { anchor, isLoading } = this.props;
        // Keep track of the previous anchor to allow scrolling
        if (!isLoading && anchor && this._lastPageAnchor !== anchor) {
            const domNode = ReactDOM.findDOMNode(this) as HTMLElement;
            if (domNode) {
                const pageContentNode = domNode.querySelector(".page-content") as HTMLElement;
                const header = Html.getHeaderElement(pageContentNode, anchor);
                if (header) {
                    this._lastPageAnchor = anchor;

                    setTimeout(() => {
                        Html.scrollIntoView(document.body, header, { force: true });
                    }, 100);
                }
            }
        }
    }
}
