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

import "components/presentation/styles/Page";
import "components/controls/styles/ActivityIndicator";
import "components/controls/styles/Button";
import "dita-ot/styles/commonltr";
import "dita-ot/styles/commonrtl";
import "prismjs/themes/prism";

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

    private _hyperlinks: { element: HTMLElement, handler: (e: Event) => void; }[] = [];
    private _codeBlocks: HTMLElement[] = [];
    private _lastPageAnchor?: string;
    private _historyUnlisten: () => void;

    /**
     * Creates an instance of Page.
     */
    constructor() {
        super();
        this.state = {
            navItems: []
        };
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
        const { navItems } = this.state;
        const { formatMessage } = this.context.services.localizationService;
        const activeNavItemId = activeHeader ? activeHeader.id : (navItems.length > 0 ? navItems[0].id : undefined);
        const _goHome = (): void => props.onNavigate(path.getRootPath());
        const errorButtons = <div>
            {/* Need to replace this button with PageLink then we don't need to pass onNaviate */}
            <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{ "click": _goHome }}>{formatMessage("components.breadcrumbs.home")}</Button>
            <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{ "click": () => this.fetchPage() }}>{formatMessage("control.button.retry")}</Button>
        </div>;
        const errorTitle = formatMessage("error.default.title");
        const errorMessages = [
            formatMessage("error.page.not.found"),
            formatMessage("error.default.message")
        ];
        const showCommentsComponents = !error && id;

        const appClass = ClassNames(direction, "page-content");

        return (
            <div className={"sdl-dita-delivery-page"} style={props.isLoading ? { overflow: "hidden" } : {}} >
                {props.isLoading ? <ActivityIndicator skin="graphene" text={formatMessage("components.app.loading")} /> : null}
                {props.children}
                <div className={"sdl-dita-delivery-content-navigation-wrapper"}>
                    <ContentNavigation navItems={navItems} activeNavItemId={activeNavItemId} />
                </div>
                <article>
                    {error
                        ? <Error
                            title={errorTitle}
                            messages={errorMessages}
                            buttons={errorButtons} />
                        : <article className={appClass}
                            dangerouslySetInnerHTML={{ __html: props.content || formatMessage("components.page.nothing.selected") }} />}
                </article>
                {showCommentsComponents && <CommentsSection />}
            </div >
        );
    }

    /**
     * Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
     */
    public componentDidMount(): void {
        this._postProcessHtml();
        this._collectHeadersLinks();
    }

    /**
     * Invoked immediately after the component's updates are flushed to the DOM. This method is not called for the initial render.
     */
    public componentDidUpdate(): void {
        this._postProcessHtml();
        this._collectHeadersLinks();
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
        } else {
            console.warn("fetchPage, publicatinoId, should be defined");
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
        const props = this.props;
        const domNode = ReactDOM.findDOMNode(this);
        if (domNode) {

            //Highlight code blocks
            const codeBlocks = this._codeBlocks;
            const highlightBlocks = domNode.querySelectorAll(".page-content pre.codeblock code");
            for (let i: number = 0, length: number = highlightBlocks.length; i < length; i++) {
                const block = highlightBlocks.item(i) as HTMLElement;
                const isAdded = codeBlocks.indexOf(block) > -1;
                if (!isAdded) {
                    if (!block.classList.contains("language-markup")) {
                        block.classList.add("language-markup");
                    }
                    codeBlocks.push(block);
                    Prism.highlightElement(block, false);
                }
            }

            // Make hyperlinks navigate when clicked
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
     */
    private _collectHeadersLinks(): void {
        const domNode = ReactDOM.findDOMNode(this);
        if (domNode) {
            const { navItems } = this.state;
            const { url } = this.props;
            const pageContentNode = domNode.querySelector(".page-content") as HTMLElement;
            const headerLinks = pageContentNode ? Html.getHeaderLinks(pageContentNode).filter((item: IHeader) => {
                // We only need level 2 and 3 for items rendered in conten navigation
                return (item.importancy == 2) || (item.importancy == 3);
            }) : [];
            const updatedNavItems: IContentNavigationItem[] = headerLinks.map(item => {
                return {
                    id: item.id,
                    title: item.title,
                    indention: Number(item.importancy == 3),
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
     */
    private _disableHyperlinks(): void {
        this._hyperlinks.forEach(anchor => {
            anchor.element.removeEventListener("click", anchor.handler);
        });
    }

    /**
     * Jump to an anchor in the page
     */
    private _jumpToAnchor(): void {
        const { anchor, isLoading } = this.props;
        // Keep track of the previous anchor to allow scrolling
        if (!isLoading && anchor && (this._lastPageAnchor !== anchor)) {
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
