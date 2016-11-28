import { Promise } from "es6-promise";
import { ISitemapItem } from "../../interfaces/ServerModels";
import { IAppContext } from "./App";
import { Toc } from "../presentation/Toc";
import { Page } from "../presentation/Page";
import { IPageInfo } from "../../models/Page";
import { Breadcrumbs } from "../presentation/Breadcrumbs";
import "./styles/PublicationContent";
import { TcmId } from "../../utils/TcmId";
import { Url } from "../../utils/Url";

/**
 * PublicationContent component props params
 *
 * @export
 * @interface IPublicationContentPropsParams
 */
export interface IPublicationContentPropsParams {
    /**
     * Id of the current publication
     *
     * @type {string}
     */
    publicationId: string;

    /**
     * The page id or the title of the current publication
     *
     * @type {string}
     */
    pageIdOrPublicationTitle?: string;

    /**
     * Title of the current publication
     *
     * @type {string}
     */
    publicationTitle?: string;

    /**
     * Title of the current page
     *
     * @type {string}
     */
    pageTitle?: string;
}

/**
 * PublicationContent component props
 *
 * @export
 * @interface IPublicationContentProps
 */
export interface IPublicationContentProps {
    /**
     * Publication content props parameters
     *
     * @type {IPublicationContentPropsParams}
     */
    params: IPublicationContentPropsParams;
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
     * @type {ISitemapItem | null}
     */
    selectedTocItem?: ISitemapItem | null;
    /**
     * Page is loading
     *
     * @type {boolean}
     */
    isPageLoading?: boolean;
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
}

interface IPage {
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
     * @type {ISitemapItem[]}
     */
    rootItems?: ISitemapItem[];
}

/**
 * Publication + content component
 */
export class PublicationContent extends React.Component<IPublicationContentProps, IPublicationContentState> {

    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired,
        router: React.PropTypes.object.isRequired
    };

    public context: IAppContext;
    private _page: IPage = {};
    private _toc: IToc = {};
    private _isUnmounted: boolean = false;

    /**
     * Creates an instance of App.
     *
     */
    constructor() {
        super();
        this.state = {
            isTocLoading: true,
            selectedTocItem: null,
            isPageLoading: true
        };
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {
        const { services } = this.context;
        const { publicationId, pageIdOrPublicationTitle } = this.props.params;
        const pageId = TcmId.isValidPageId(pageIdOrPublicationTitle) ? pageIdOrPublicationTitle : null;
        const getRootItems = (path?: string[]): void => {
            // Get the data for the Toc
            services.taxonomyService.getSitemapRoot(publicationId).then(
                items => {
                    /* istanbul ignore else */
                    if (!this._isUnmounted) {
                        this._toc.rootItems = items;
                        this.setState({
                            activeTocItemPath: path,
                            isTocLoading: false,
                            isPageLoading: Array.isArray(items) && items.length > 0
                        });
                    }
                },
                error => {
                    /* istanbul ignore else */
                    if (!this._isUnmounted) {
                        this._toc.error = error;
                        this.setState({
                            isTocLoading: false,
                            isPageLoading: false
                        });
                    }
                });
        };

        if (pageId) {
            // Set the current active path for the tree
            this._getActiveSitemapPath(pageId, getRootItems);
        } else {
            getRootItems();
        }
    }

    /**
     * Invoked when a component is receiving new props. This method is not called for the initial render.
     *
     * @param {IPublicationContentProps} nextProps
     */
    public componentWillReceiveProps(nextProps: IPublicationContentProps): void {
        const { pageIdOrPublicationTitle } = this.props.params;
        const pageId = TcmId.isValidPageId(pageIdOrPublicationTitle) ? pageIdOrPublicationTitle : null;
        const nextpageIdOrPublicationTitle = nextProps.params.pageIdOrPublicationTitle;
        const nextPageId = TcmId.isValidPageId(nextpageIdOrPublicationTitle) ? nextpageIdOrPublicationTitle : null;

        if (nextPageId) {
            if (!pageId || nextPageId !== pageId) {
                // Set the current active path for the tree
                this._getActiveSitemapPath(nextPageId, (path) => {
                    this.setState({
                        activeTocItemPath: path
                    });
                });
            }
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
        const { services } = this.context;
        const { publicationId } = this.props.params;
        const pageService = services.pageService;
        const { selectedTocItem, isPageLoading } = this.state;
        const currentId = selectedTocItem ? selectedTocItem.Id : null;
        const nextId = nextState.selectedTocItem ? nextState.selectedTocItem.Id : null;
        if (nextState.selectedTocItem && !nextState.selectedTocItem.Url) {
            this._page.content = `<h1 class="title topictitle1">${nextState.selectedTocItem.Title}</h1>`;
            return;
        }
        if (nextId && (isPageLoading || currentId !== nextId)) {
            // After upgrading to DXA 1.7 use TcmId.getItemIdFromTaxonomyId
            const pageId = TcmId.parseId(nextId);
            pageService.getPageInfo(publicationId, pageId ? pageId.itemId : nextId).then(
                this._onPageContentRetrieved.bind(this),
                this._onPageContentRetrievFailed.bind(this));
        }
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { isPageLoading, activeTocItemPath, selectedTocItem, publicationTitle } = this.state;
        const { services, router } = this.context;
        const { publicationId } = this.props.params;
        const taxonomyService = services.taxonomyService;
        const { content, error} = this._page;
        const { rootItems } = this._toc;
        const tocError = this._toc.error;

        return (
            <section className={"sdl-dita-delivery-publication-content"}>
                <Toc
                    activeItemPath={activeTocItemPath}
                    rootItems={rootItems}
                    loadChildItems={(parentId: string): Promise<ISitemapItem[]> => {
                        // TODO: this conversion will not be needed when upgrading to DXA 1.7
                        // https://jira.sdl.com/browse/TSI-2131
                        const taxonomyItemId = TcmId.getTaxonomyItemId("1", parentId);
                        return taxonomyService.getSitemapItems(publicationId, taxonomyItemId || parentId);
                    } }
                    onSelectionChanged={this._onTocSelectionChanged.bind(this)}
                    error={tocError} />

                <Page
                    showActivityIndicator={isPageLoading || false}
                    content={content}
                    error={error}
                    onNavigate={(url: string): void => {
                        /* istanbul ignore else */
                        if (router) {
                            router.push(url);
                        }
                    } } >
                    <Breadcrumbs
                        publicationId={publicationId}
                        publicationTitle={publicationTitle || ""}
                        loadItemsPath={taxonomyService.getSitemapPath.bind(taxonomyService)}
                        selectedItem={selectedTocItem}
                        />
                </Page>
            </section>
        );
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount(): void {
        this._isUnmounted = true;
    }

    private _onTocSelectionChanged(sitemapItem: ISitemapItem, path: string[]): void {
        const page = this._page;
        const { router, services } = this.context;
        const { publicationId, pageIdOrPublicationTitle } = this.props.params;
        const publicationService = services.publicationService;
        const pageId = TcmId.isValidPageId(pageIdOrPublicationTitle) ? pageIdOrPublicationTitle : null;

        page.error = null;

        publicationService.getPublicationTitle(publicationId).then(
            title => {
                this.setState({
                    activeTocItemPath: path,
                    publicationTitle: title,
                    selectedTocItem: sitemapItem,
                    isPageLoading: sitemapItem.Url ? true : false
                });

                /* istanbul ignore else */
                if (router) {
                    const navPath = sitemapItem.Url || Url.getPublicationUrl(publicationId, title);
                    // After upgrading to DXA 1.7 use TcmId.getItemIdFromTaxonomyId
                    const siteMapPageId = TcmId.parseId(sitemapItem.Id);
                    if (siteMapPageId && siteMapPageId.itemId === pageId) {
                        router.replace(navPath);
                    }
                    else {
                        router.push(navPath);
                    }
                }
            },
            error => {
                page.error = error;

                this.setState({
                    activeTocItemPath: path,
                    selectedTocItem: sitemapItem,
                    isPageLoading: sitemapItem.Url ? true : false
                });
            });
    }

    private _onPageContentRetrieved(pageInfo: IPageInfo): void {
        const page = this._page;
        page.content = pageInfo.content;
        this.setState({
            isPageLoading: false
        });
    }

    private _onPageContentRetrievFailed(error: string): void {
        const page = this._page;
        page.error = error;
        page.content = null;
        this.setState({
            isPageLoading: false
        });
    }

    private _getActiveSitemapPath(pageId: string, done: (path: string[]) => void): void {
        const { services } = this.context;
        const { publicationId } = this.props.params;
        services.taxonomyService.getSitemapPath(publicationId, pageId).then(
            path => {
                /* istanbul ignore else */
                if (!this._isUnmounted) {
                    done(path.map(item => item.Id || "") || []);
                }
            },
            error => {
                /* istanbul ignore else */
                if (!this._isUnmounted) {
                    this._toc.error = error;
                    this.setState({
                        isTocLoading: false,
                        isPageLoading: false
                    });
                }
            });
    }
}
