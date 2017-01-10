import * as React from "react";
import * as ReactDOM from "react-dom";
import { Html, IHeader } from "utils/Html";
import { Url } from "utils/Url";
import { ContentNavigation, IContentNavigationItem } from "components/presentation/ContentNavigation";
import { ActivityIndicator, ValidationMessage } from "sdl-controls-react-wrappers";
import { ValidationMessageType } from "sdl-controls";

import "components/presentation/styles/Page";
import "dist/dita-ot/styles/commonltr";
import "dist/dita-ot/styles/commonrtl";

/**
 * Page component props
 *
 * @export
 * @interface IPageProps
 */
export interface IPageProps {
    /**
     * Show activity indicator
     *
     * @type {boolean}
     */
    showActivityIndicator: boolean;
    /**
     * Page content
     *
     * @type {string | null}
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
     * @memberOf IPublicationContentProps
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
     * Scroll offset using for jumping to anchors
     * For example when there is a topbar overlaying part of the component
     *
     * @type {number}
     * @memberOf IPageProps
     */
    scrollOffset?: number;
    /**
     * Header which is active.
     * The header inside the page which is the first one visible in the view port.
     *
     * @type {IHeader}
     * @memberOf IPageProps
     */
    activeHeader?: IHeader;
    /**
     * Called whenever navigation to another page is requested
     *
     * @param {string} url Url
     *
     * @memberOf IPageProps
     */
    onNavigate(url: string): void;
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
     */
    navItems: IContentNavigationItem[];
}

/**
 * Page component
 */
export class Page extends React.Component<IPageProps, IPageState> {

    private _hyperlinks: { element: HTMLElement, handler: (e: Event) => void; }[] = [];
    private _lastAnchor: string;

    /**
     * Creates an instance of Toc.
     *
     */
    constructor() {
        super();
        this.state = {
            navItems: []
        };
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     *
     * @memberOf Page
     */
    public render(): JSX.Element {
        const props = this.props;
        const { activeHeader } = props;
        const { navItems } = this.state;
        const activeNavItemId = activeHeader ? activeHeader.id : (navItems.length > 0 ? navItems[0].id : undefined);
        return (
            <div className={"sdl-dita-delivery-page"}>
                {props.showActivityIndicator ? <ActivityIndicator /> : null}
                {props.error ? <ValidationMessage messageType={ValidationMessageType.Error} message={props.error} /> : null}
                {props.children}
                <ContentNavigation navItems={navItems} activeNavItemId={activeNavItemId} />
                <article>
                    <article className={"page-content ltr"} dangerouslySetInnerHTML={{ __html: props.content || "" }} />
                </article>
            </div>
        );
    }

    /**
     * Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
     */
    public componentDidMount(): void {
        this._enableHyperlinks();
        this._collectHeadersLinks();
    }

    /**
     * Invoked immediately after the component's updates are flushed to the DOM. This method is not called for the initial render.
     *
     * @memberOf Page
     */
    public componentDidUpdate(): void {
        this._enableHyperlinks();
        this._collectHeadersLinks();
        this._jumpToAnchor();
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount(): void {
        this._disableHyperlinks();
    }

    /**
     * Make hyperlinks navigate when clicked
     *
     * @private
     *
     * @memberOf Page
     */
    private _enableHyperlinks(): void {
        const props = this.props;
        const domNode = ReactDOM.findDOMNode(this);
        if (domNode) {
            const anchors = domNode.querySelectorAll(".page-content a");
            const hyperlinks = this._hyperlinks;
            for (let i: number = 0, length: number = anchors.length; i < length; i++) {
                const anchor = anchors.item(i) as HTMLAnchorElement;
                const alreadyAdded = hyperlinks.filter(hyperlink => hyperlink.element === anchor).length === 1;
                if (!alreadyAdded) {
                    const itemUrl = anchor.getAttribute("href");
                    if (Url.itemUrlIsValid(itemUrl)) {
                        const onClick = (e: Event): void => {
                            if (itemUrl) {
                                props.onNavigate(itemUrl);
                            }
                            e.preventDefault();
                        };
                        hyperlinks.push({
                            element: anchor,
                            handler: onClick
                        });
                        anchor.addEventListener("click", onClick);
                    }
                }
            }
        }
    }

    /**
     * Collects headers links
     *
     * @private
     *
     * @memberOf Page
     */
    private _collectHeadersLinks(): void {
        const domNode = ReactDOM.findDOMNode(this);
        if (domNode) {
            const { navItems } = this.state;
            const { url } = this.props;
            const pageContentNode = domNode.querySelector(".page-content") as HTMLElement;
            const headerLinks = Html.getHeaderLinks(pageContentNode);
            const updatedNavItems: IContentNavigationItem[] = headerLinks.map(item => {
                return {
                    id: item.id,
                    title: item.title,
                    url: url ? Url.getAnchorUrl(url, item.id) : ("#" + item.id)
                };
            });

            if (navItems.map((i) => i.url).join("") !== updatedNavItems.map((i) => i.url).join("")) {
                this.setState({
                    navItems: updatedNavItems
                });
            }
        }
    }

    /**
     * Make hyperlinks navigation disabled
     *
     * @private
     *
     * @memberOf Page
     */
    private _disableHyperlinks(): void {
        this._hyperlinks.forEach(anchor => {
            anchor.element.removeEventListener("click", anchor.handler);
        });
    }

    /**
     * Jump to an anchor in the page
     *
     * @private
     *
     * @memberOf Page
     */
    private _jumpToAnchor(): void {
        const { anchor, scrollOffset } = this.props;
        // Keep track of the previous anchor to allow scrolling
        if (anchor && anchor !== this._lastAnchor) {
            const domNode = ReactDOM.findDOMNode(this) as HTMLElement;
            if (domNode) {
                const pageContentNode = domNode.querySelector(".page-content") as HTMLElement;
                const header = Html.getHeaderElement(pageContentNode, anchor);
                if (header) {
                    this._lastAnchor = anchor;
                    // TODO: make sure images are loaded before jumping to the anchor
                    // Use a timeout to make sure all components are rendered
                    setTimeout((): void => {
                    var topPos = (header.offsetTop + domNode.offsetTop) - (scrollOffset || 0);
                        window.scrollTo(0, topPos);
                    }, 0);
                }
            }
        }
    }
}
