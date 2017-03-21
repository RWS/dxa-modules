import * as React from "react";
import * as ReactDOM from "react-dom";
import { Promise } from "es6-promise";
import { ITaxonomy } from "interfaces/Taxonomy";
import { IPage } from "interfaces/Page";
import { TaxonomyItemId } from "interfaces/TcmId";

import { IAppContext } from "components/container/App";
import { NavigationMenu } from "components/presentation/NavigationMenu";
import { Toc } from "components/presentation/Toc";
import { Page } from "components/Page/Page";
import { Breadcrumbs } from "components/presentation/Breadcrumbs";
import { ContentLanguageWarning } from "components/ContentLanguageWarning/ContentLanguageWarning";

import { Html, IHeader } from "utils/Html";
import { TcmId } from "utils/TcmId";
import { Url } from "utils/Url";
import { debounce } from "utils/Function";

import { IPublicationCurrentState } from "store/interfaces/State";
import { FetchPublications } from "components/helpers/FetchPublications";
import { RouteToState } from "components/helpers/RouteToState";
import { StateToRoute } from "components/helpers/StateToRoute";

import "./PublicationContent.less";
import { IPublication } from "interfaces/Publication";
import { isDummyPage, isPage } from "utils/Page";

/**
 * PublicationContent component props
 *
 * @export
 * @interface IPublicationContentProps
 */
export interface IPublicationContentProps {

    publication: IPublication;
    page: IPage;
    errorMessage: string;
    isPageLoading: boolean;

    onPulicationChange?: (publication: {}) => void;
}

/**
 * PublicationContent component state
 *
 * @export
 * @interface IPublicationContentState
 */
export interface IPublicationContentState {
    /**
     * Toc is loading
     *
     * @type {boolean}
     */
    isTocLoading?: boolean;
    /**
     * Current selected item in the TOC
     *
     * @type {ITaxonomy | null}
     */
    selectedTocItem?: ITaxonomy | null;
    /**
     * Page is loading
     *
     * @type {boolean}
     */
    //isPageLoading?: boolean;
    /**
     * Current active item path in the TOC
     *
     * @type {string[]}
     */
    activeTocItemPath?: string[];
    /**
     * Title of the current publication
     *
     * @type {string}
     */
    publicationTitle?: string;
    /**
     * Active header inside the page
     *
     * @type {IHeader}
     * @memberOf IPublicationContentState
     */
    activePageHeader?: IHeader;
}

interface ISelectedPage {
    /**
     * Content of the current selected page
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
}

interface IToc {
    /**
     * An error prevented the toc from rendering
     *
     * @type {string}
     */
    error?: string;
    /**
     * Root items
     *
     * @type {ITaxonomy[]}
     */
    rootItems?: ITaxonomy[];
}

export type Pub = IPublicationContentProps & IPublicationCurrentState;

/**
 * Publication + content component
 */
export class PublicationContentPresentation extends React.Component<Pub, IPublicationContentState> {

    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired,
        router: React.PropTypes.object.isRequired
    };

    public context: IAppContext;
    private _page: ISelectedPage = {};
    private _toc: IToc = {};
    private _isUnmounted: boolean = false;
    private _topOffset: number = 0;

    /**
     * Creates an instance of App.
     *
     */
    constructor() {
        super();
        this.state = {
            isTocLoading: true,
            selectedTocItem: null
        };

        this._fixPanels = this._fixPanels.bind(this);
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public fetchPublication(publicationId: string): void {
//        this is temporary hack to move out loading data from this component
        if (publicationId) {
            // Load the page
            this._loadTocRootItems(publicationId);
        }
    }

    public fetchPage(page: IPage): void {
        this._onPageContentRetrieved(page);
    }

    /**
     * Invoked when a component is receiving new props. This method is not called for the initial render.
     *
     * @param {IPublicationContentProps} nextProps
     */
    public componentWillReceiveProps(nextProps: Pub): void {
       const { page } = this.props;
       const { publicationId: nextPubId, page: nextPage, errorMessage} = nextProps;
       if (!isPage(nextPage)) {
            this.fetchPublication(nextPubId);
       } else if (nextPage && nextPage.content !== page.content && !isDummyPage(nextPage)) {
            this.fetchPage(nextPage);
       } else if (errorMessage) {
           this._onPageContentRetrievFailed(errorMessage);
       }
    }

    /**
     * Invoked immediately before rendering when new props or state are being received.
     * This method is not called for the initial render.
     *
     * @param {IPublicationContentProps} nextProps Next props
     * @param {IPublicationContentState} nextState Next state
     */
    public componentWillUpdate(nextProps: IPublicationContentProps, nextState: IPublicationContentState): void {
        if (nextState.selectedTocItem && !nextState.selectedTocItem.url) {
            this._page.content = `<h1 class="title topictitle1">${nextState.selectedTocItem.title}</h1>`;
            //nextState.isPageLoading = false;
            return;
        }
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { activeTocItemPath, selectedTocItem, activePageHeader } = this.state;

        const { services, router } = this.context;
        const { publicationId, pageId, page, publication, isPageLoading, errorMessage } = this.props;

        const { taxonomyService } = services;
        const { rootItems } = this._toc;
        const tocError = this._toc.error;
        return (
            <section className={"sdl-dita-delivery-publication-content"}>
                <RouteToState />
                <StateToRoute />
                <FetchPublications />
                <Page
                    showActivityIndicator={isPageLoading}
                    content={page.content}
                    error={errorMessage}
                    onNavigate={(url: string): void => {
                        /* istanbul ignore else */
                        if (router) {
                            router.push(url);
                        }
                    } }
                    url={pageId ?
                        Url.getPageUrl(publicationId, pageId, publication.title, page.title || (selectedTocItem && selectedTocItem.title) || "") :
                        Url.getPublicationUrl(publicationId, publication.title)}
                    scrollOffset={this._topOffset}
                    activeHeader={activePageHeader}>
                    <NavigationMenu isOpen={false}>{/* TODO: use global state store */}
                        <Toc
                            activeItemPath={activeTocItemPath}
                            rootItems={rootItems}
                            loadChildItems={(parentId: string): Promise<ITaxonomy[]> => {
                                return taxonomyService.getSitemapItems(publicationId, parentId);
                            } }
                            onSelectionChanged={this._onTocSelectionChanged.bind(this)}
                            error={tocError}
                            onRetry={() => this._loadTocRootItems(publicationId) }
                            >
                            <span className="separator" />
                        </Toc>
                    </NavigationMenu>
                    <Breadcrumbs
                        publicationId={publicationId}
                        publicationTitle={publication.title || ""}
                        loadItemsPath={taxonomyService.getSitemapPath.bind(taxonomyService)}
                        selectedItem={selectedTocItem}
                        />
                    <ContentLanguageWarning />
                </Page>
            </section>
        );
    }

    /**
     * Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
     */
    public componentDidMount(): void {
        if (ReactDOM) {
            const domNode = ReactDOM.findDOMNode(this) as HTMLElement;
            if (domNode) {
                this._topOffset = domNode.offsetTop;
            }
        }

        window.addEventListener("scroll", this._fixPanels);
        window.addEventListener("resize", this._fixPanels);
        this._fixPanels();
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount(): void {
        this._isUnmounted = true;

        window.removeEventListener("scroll", this._fixPanels);
        window.removeEventListener("resize", this._fixPanels);
    }

    private _onTocSelectionChanged(sitemapItem: ITaxonomy, path: string[]): void {
        const { onPulicationChange, pageId, publicationId } = this.props;

        const updatedState: IPublicationContentState = {
            activeTocItemPath: path,
            selectedTocItem: sitemapItem,
            isTocLoading: false
        };
        this.setState(updatedState);

        // When the tree is expanding it is also calling the onTocSelectionChanged callback
        /* istanbul ignore else */
        const navPath = sitemapItem.url;
        const parsedUrl = navPath && Url.parsePageUrl(navPath);
        const pageHasChanged = parsedUrl && (pageId !== parsedUrl.pageId || publicationId !== parsedUrl.publicationId);
        if (pageHasChanged && parsedUrl && onPulicationChange) {
            onPulicationChange({
                publicationId: parsedUrl.publicationId,
                pageId: parsedUrl.pageId
            });
        }
    }

    private _onPageContentRetrieved(pageInfo: IPage): void {
        const { publicationId } = this.props;
        const { activeTocItemPath, isTocLoading } = this.state;
        const page = this._page;
        page.error = null;
        page.content = pageInfo.content;

        // this.setState({
        //     isPageLoading: false
        // });
        // Set the current active path for the tree
        if (Array.isArray(pageInfo.sitemapIds) && pageInfo.sitemapIds.length > 0) {
            // Always take the first sitemap id
            // There is no proper way for having a deep link to the second/third/... occurance inside the toc
            const firstSitemapId = pageInfo.sitemapIds[0];
            const taxonomyId = TcmId.getTaxonomyItemId(TaxonomyItemId.Toc, firstSitemapId) || firstSitemapId;

            this._getActiveSitemapPath(pageInfo.id, taxonomyId, path => {
                /* istanbul ignore if */
                if (this._isUnmounted) {
                    return;
                }

                if (isTocLoading) {
                    this._loadTocRootItems(publicationId, path);
                } else if (!activeTocItemPath || path.join("") !== activeTocItemPath.join("")) {
                    this.setState({
                        activeTocItemPath: path
                    });
                }
            });
        } else if (isTocLoading) {
            this._loadTocRootItems(publicationId);
        }
    }

    private _onPageContentRetrievFailed(error: string): void {
        const { publicationId } = this.props;
        const { isTocLoading } = this.state;
        const page = this._page;
        page.error = error;
        page.content = null;

        if (publicationId && isTocLoading) {
            this._loadTocRootItems(publicationId);
        }
    }

    private _getActiveSitemapPath(pageId: string, sitemapId: string, done: (path: string[]) => void): void {
        const { services } = this.context;
        const { publicationId } = this.props;

        if (pageId) {
            services.taxonomyService.getSitemapPath(publicationId, pageId, sitemapId).then(
                path => {
                    /* istanbul ignore else */
                    if (!this._isUnmounted) {
                        done(path.map(item => item.id || "") || []);
                    }
                },
                error => {
                    /* istanbul ignore else */
                    if (!this._isUnmounted) {
                        this._toc.error = error;
                        this.setState({
                            isTocLoading: false
                        });
                    }
                });
        }
    }

    private _fixPanels(): void {
        /* istanbul ignore if */
        if (this._isUnmounted) {
            return;
        }

        let ticking = false;

        // Set height of toc and content navigation panel to a maximum
        const domNode = ReactDOM.findDOMNode(this) as HTMLElement;
        if (domNode) {
            const toc = domNode.querySelector("nav.sdl-dita-delivery-toc") as HTMLElement;
            const contentNavigation = domNode.querySelector("nav.sdl-dita-delivery-content-navigation") as HTMLElement;
            const page = domNode.querySelector(".sdl-dita-delivery-page") as HTMLElement;
            if (!ticking) {
                requestAnimationFrame((): void => {
                    this._updatePanels(page, toc, contentNavigation);
                    ticking = false;
                });
                ticking = true;
            }
        }
    }

    private _updatePanels(page: HTMLElement, toc: HTMLElement, contentNavigation: HTMLElement): void {
        /* istanbul ignore if */
        if (!this._isUnmounted) {
            if (contentNavigation && page) {
                // Update active title inside content navigation panel
                const pageContent = page.querySelector(".page-content") as HTMLElement;
                if (pageContent) {
                    const header = Html.getActiveHeader(document.body, pageContent, 0);
                    if (header && header !== this.state.activePageHeader) {
                        this.setState({
                            activePageHeader: header
                        });
                        debounce((): void => {
                            // Make sure the active link is in view
                            const activeLinkEl = contentNavigation.querySelector("li.active") as HTMLElement;
                            if (activeLinkEl) {
                                Html.scrollIntoView(contentNavigation, activeLinkEl);
                            }
                        })();
                    }
                }
            }
        }
    }

    private _loadTocRootItems(publicationId: string, path?: string[]): void {
        const { services } = this.context;
        // Get the data for the Toc
        this._toc.rootItems = [];
        this._toc.error = undefined;
        this.setState({
            activeTocItemPath: undefined,
            selectedTocItem: null,
            isTocLoading: true
        });

        services.taxonomyService.getSitemapRoot(publicationId).then(
            items => {
                /* istanbul ignore else */
                if (!this._isUnmounted) {
                    this._toc.rootItems = items;
                    this._toc.error = undefined;
                    this.setState({
                        activeTocItemPath: path,
                        isTocLoading: false
                    });
                }
            },
            error => {
                /* istanbul ignore else */
                if (!this._isUnmounted) {
                    this._toc.error = error;
                    this.setState({
                        isTocLoading: false
                    });
                }
            });
    }
}
