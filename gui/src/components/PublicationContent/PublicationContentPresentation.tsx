/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as PropTypes from "prop-types";
import { browserHistory } from "react-router";
import { Promise } from "es6-promise";
import { IAppContext } from "@sdl/dd/container/App/App";
import { NavigationMenu } from "@sdl/dd/presentation/NavigationMenu";
import { Toc } from "@sdl/dd/presentation/Toc";
import { Page } from "@sdl/dd/Page/Page";
import { Breadcrumbs, IBreadcrumbItem } from "@sdl/dd/presentation/Breadcrumbs";
import { ContentLanguageWarning } from "@sdl/dd/ContentLanguageWarning/ContentLanguageWarning";
import { Splitter } from "@sdl/dd/Splitter/Splitter";

import { VersionSelector } from "@sdl/dd/presentation/VersionSelector";
import { Html, IHeader } from "utils/Html";
import { TcmId } from "utils/TcmId";
import { Url } from "utils/Url";
import { isDummyPage, isPage } from "utils/Page";

import { ITaxonomy } from "interfaces/Taxonomy";
import { IPage } from "interfaces/Page";
import { TaxonomyItemId } from "interfaces/TcmId";
import { IPublication } from "interfaces/Publication";
import { ICurrentLocationState } from "store/interfaces/State";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { IPageService } from "services/interfaces/PageService";

import { DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE } from "models/Publications";

import Version from "utils/Version";

import "./PublicationContent.less";
import { MD5 } from "object-hash";
import { IConditionMap } from "store/interfaces/Conditions";

/**
 * PublicationContent component props
 *
 * @export
 * @interface IPublicationContentProps
 */
export interface IPublicationContentProps {
    /**
     * Publication
     *
     * @type {IPublication}
     * @memberOf IPublicationContentProps
     */
    publication: IPublication;

    /**
     * Page
     *
     * @type {IPage}
     * @memberOf IPublicationContentProps
     */
    page: IPage;
    /**
     * Possible error message while page loading
     *
     * @type {string}
     * @memberOf IPublicationContentProps
     */
    errorMessage: string;
    /**
     * Is Page loading status
     *
     * @type {boolean}
     * @memberOf IPublicationContentProps
     */
    isPageLoading: boolean;
    /**
     * Available product release versions for the selected publication
     *
     * @type {IProductReleaseVersion[]}
     * @memberOf IPublicationsListState
     */
    productReleaseVersions: IProductReleaseVersion[];
    /**
     *
     * @type {string}
     * @memberOf IPublicationContentProps
     */
    productReleaseVersion: string;
    /**
     * Function to execute when publication is changing
     *
     * @type {Function}
     * @memberOf IPublicationContentProps
     */
    onPublicationChange?: (publicationId: string, pageId: string, taxomonyId?: string) => void;
    /**
     *
     * @memberOf IPublicationContentProps
     */
    onReleaseVersionChanged?: (publicationId: string, releaseVersions: string) => void;
    /**
     *
     * @memberOf IPublicationContentProps
     */
    onPageReleaseVersionChanged?: (
        pageService: IPageService,
        publicationId: string,
        releaseVersions: string,
        logicalId: string,
        conditions: IConditionMap
    ) => void;
    /**
     *
     * @type {boolean}
     * @memberOf IPublicationContentProps
     */
    isPublicationFound: boolean;

    /**
     *
     * @type {IConditionMap}
     * @memberOf IPublicationContentProps
     */
    conditions: IConditionMap;

    /**
     *
     * @type {number}
     * @memberOf IPublicationContentProps
     */
    splitterPosition: number;
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
     * Current active item path in the TOC
     *
     * @type {string[]}
     */
    activeTocItemPath?: string[];

    /**
     * Active header inside the page
     *
     * @type {IHeader}
     * @memberOf IPublicationContentState
     */
    activePageHeader?: IHeader;

    /**
     * Relative splitter position
     *
     * @type {number}
     * @memberOf IPublicationContentState
     */
    splitterPositionX?: number | null;
}

interface IToc {
    /**
     * An error prevented the toc from rendering
     *
     * @type {string}
     * @memberOf IToc
     */
    error?: string;
    /**
     * Root items
     *
     * @type {ITaxonomy[]}
     * @memberOf IToc
     */
    rootItems?: ITaxonomy[];
}

/**
 * Publication content props
 */
export type Pub = IPublicationContentProps & ICurrentLocationState;

/**
 * Publication + content component
 */
export class PublicationContentPresentation extends React.Component<Pub, IPublicationContentState> {
    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: PropTypes.object.isRequired
    };

    public context: IAppContext;
    private _toc: IToc = {};
    private _isUnmounted: boolean = false;

    /**
     * Creates an instance of App.
     */
    constructor() {
        super();
        this.state = {
            isTocLoading: true,
            selectedTocItem: null
        };

        this._fixPanels = this._fixPanels.bind(this);
        this._navigateToOtherReleaseVersion = this._navigateToOtherReleaseVersion.bind(this);
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public fetchPublication(publicationId: string): void {
        // this is temporary hack to move out loading data from this component
        if (publicationId) {
            // Load the page
            this._loadTocRootItems(publicationId);
        }
    }

    public refreshToc(publicationId: string, page: IPage, taxonomyId?: string): void {
        this._onPageContentRetrieved(publicationId, page, taxonomyId);
    }

    public componentDidMount(): void {
        const { publicationId, page, errorMessage } = this.props;
        if (!isPage(page)) {
            this.fetchPublication(publicationId);
        }

        if (isPage(page) && !isDummyPage(page)) {
            this.refreshToc(publicationId, page);
        } else if (errorMessage) {
            this._onPageContentRetrievFailed(publicationId, errorMessage);
        }

        this.addResizeHandlers();
    }

    /**
     *
     * @param {Pub} prevProps
     *
     * @memberOf PublicationContentPresentation
     */
    public componentWillReceiveProps(nextProps: Pub): void {
        const { page, publicationId } = this.props;
        const { publicationId: nextPubId, page: nextPage, taxonomyId: nextTaxonomyId, errorMessage } = nextProps;

        if (!isPage(nextPage)) {
            this.fetchPublication(nextPubId);
        }

        if (errorMessage) {
            this._onPageContentRetrievFailed(nextPubId, errorMessage);
        } else if (isPage(nextPage)) {
            if (nextPubId !== publicationId || MD5(nextProps.conditions) !== MD5(this.props.conditions)) {
                this.setState(
                    {
                        isTocLoading: true
                    },
                    () => this.refreshToc(nextPubId, nextPage)
                );
            } else if (!isDummyPage(nextPage) && nextPage.content !== page.content) {
                this.refreshToc(nextPubId, nextPage, nextTaxonomyId);
            }
        }
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { activeTocItemPath, selectedTocItem, activePageHeader } = this.state;
        const { services } = this.context;
        const {
            publicationId,
            pageId,
            page,
            publication,
            isPageLoading,
            errorMessage,
            productReleaseVersion,
            productReleaseVersions,
            isPublicationFound
        } = this.props;

        const { taxonomyService, localizationService } = services;
        const { rootItems, error: tocError } = this._toc;
        const selectedProductReleaseVersion = Version.normalizeReleaseVersion(productReleaseVersion);
        return (
            <section className={"sdl-dita-delivery-publication-content"}>
                <NavigationMenu isOpen={false}>
                    {/* TODO: use global state store */}
                    <Toc
                        activeItemPath={activeTocItemPath}
                        publicationId={publicationId}
                        rootItems={rootItems}
                        loadChildItems={(parentId: string): Promise<ITaxonomy[]> => {
                            return taxonomyService.getSitemapItems(publicationId, parentId);
                        }}
                        onSelectionChanged={this._onTocSelectionChanged.bind(this)}
                        error={tocError}
                        onRetry={() => this._loadTocRootItems(publicationId)}
                    />
                </NavigationMenu>
                <Splitter />
                <Page
                    isLoading={isPageLoading}
                    content={page.content}
                    error={errorMessage}
                    onNavigate={(url: string): void => {
                        /* istanbul ignore else */
                        if (browserHistory) {
                            browserHistory.push(url);
                        }
                    }}
                    url={
                        pageId
                            ? Url.getPageUrl(
                                  publicationId,
                                  pageId,
                                  publication.title,
                                  page.title || (selectedTocItem && selectedTocItem.title) || ""
                              )
                            : Url.getPublicationUrl(publicationId, publication.title)
                    }
                    activeHeader={activePageHeader}>
                    <Breadcrumbs
                        loadItemPath={(breadcrumbItem: ITaxonomy): Promise<IBreadcrumbItem[]> => {
                            const publicationTitle = isPublicationFound
                                ? publication.title || ""
                                : localizationService.formatMessage("error.publication.not.found", [publication.id]);
                            // TODO: fix the way to retrieve family Title
                            const productFamilyTitle = Array.isArray(publication.productFamily) ? publication.productFamily[0] : null;
                            let breadCrumbPath = [
                                {
                                    title:
                                        productFamilyTitle ||
                                        localizationService.formatMessage("productfamilies.unknown.title"),
                                    url: Url.getProductFamilyUrl(
                                        productFamilyTitle || DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE,
                                        selectedProductReleaseVersion
                                    )
                                },
                                {
                                    title: publicationTitle,
                                    url: Url.getPublicationUrl(publicationId, publicationTitle)
                                }
                            ] as IBreadcrumbItem[];
                            const parsedUrl = breadcrumbItem.url && Url.parsePageUrl(breadcrumbItem.url);
                            if (parsedUrl && parsedUrl.pageId) {
                                return taxonomyService
                                    .getSitemapPath(publicationId, parsedUrl.pageId, breadcrumbItem.id || "")
                                    .then(
                                        path => {
                                            breadCrumbPath.push(
                                                ...path.map(item => {
                                                    return {
                                                        title: item.title,
                                                        url: item.url
                                                    } as IBreadcrumbItem;
                                                })
                                            );
                                            return breadCrumbPath;
                                        },
                                        siteMapError => {
                                            return Promise.reject(siteMapError);
                                        }
                                    );
                            } else {
                                return Promise.resolve(breadCrumbPath);
                            }
                        }}
                        selectedItem={selectedTocItem}
                    />
                    <ContentLanguageWarning />
                    {Array.isArray(productReleaseVersions) &&
                        productReleaseVersions.length > 1 && (
                            <VersionSelector
                                productReleaseVersions={productReleaseVersions}
                                selectedProductReleaseVersion={selectedProductReleaseVersion}
                                onChange={(version: string) =>
                                    this._navigateToOtherReleaseVersion(version, page.logicalId)
                                }
                            />
                        )}
                </Page>
            </section>
        );
    }

    /**
     * Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
     */
    public addResizeHandlers(): void {
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
        const { onPublicationChange, pageId, publicationId } = this.props;

        const updatedState: IPublicationContentState = {
            activeTocItemPath: path,
            selectedTocItem: sitemapItem,
            isTocLoading: false
        };
        this.setState(updatedState);

        // When the tree is expanding it is also calling the onTocSelectionChanged callback
        /* istanbul ignore else */
        const parsedUrl = sitemapItem.url && Url.parsePageUrl(sitemapItem.url);
        if (parsedUrl) {
            const { pageId: parsedPageId, publicationId: parsedPubId } = parsedUrl;
            const pageHasChanged = pageId !== parsedPageId && publicationId === parsedPubId;
            if (pageHasChanged && onPublicationChange) {
                onPublicationChange(parsedPubId, parsedPageId, sitemapItem.id);
            }
        }
    }

    private _onPageContentRetrieved(publicationId: string, pageInfo: IPage, taxonomyId?: string): void {
        const { activeTocItemPath, isTocLoading } = this.state;

        // Set the current active path for the tree
        if (Array.isArray(pageInfo.sitemapIds) && pageInfo.sitemapIds.length > 0) {
            // Always take the first sitemap id
            // There is no proper way for having a deep link to the second/third/... occurance inside the toc
            const firstSitemapId = pageInfo.sitemapIds[0];

            taxonomyId = taxonomyId || TcmId.getTaxonomyItemId(TaxonomyItemId.Toc, firstSitemapId) || firstSitemapId;

            this._getActiveSitemapPath(publicationId, pageInfo.id, taxonomyId, path => {
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

    private _onPageContentRetrievFailed(publicationId: string, error: string): void {
        const { isTocLoading } = this.state;

        if (publicationId && isTocLoading) {
            this._loadTocRootItems(publicationId);
        }
    }

    private _getActiveSitemapPath(
        publicationId: string,
        pageId: string,
        sitemapId: string,
        done: (path: string[]) => void
    ): void {
        const { services } = this.context;

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
                }
            );
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
            let tmpState = {};
            if (page) {
                // Update active title inside content navigation panel
                const pageContent = page.querySelector(".page-content") as HTMLElement;
                if (pageContent) {
                    if (contentNavigation) {
                        const activePageHeader = Html.getActiveHeader(document.body, pageContent, 0);
                        if (activePageHeader && activePageHeader !== this.state.activePageHeader) {
                            Object.assign(tmpState, { activePageHeader });
                        }
                    }
                }

                const tocParent = toc.parentNode as HTMLElement;
                if (tocParent) {
                    const { splitterPosition } = this.props;
                    tocParent.style.flexBasis = splitterPosition + "px";
                    if (toc.offsetParent != toc.parentNode) {
                        // 30px is the margins. It is easier to hardcode this values than for the browser to recalculate it all the time.
                        toc.setAttribute("style", `width: ${tocParent.getBoundingClientRect().width - 30}px`);
                    } else {
                        toc.removeAttribute("style");
                    }
                }
            }

            if (Object.keys(tmpState).length > 0) {
                this.setState(tmpState);
            }
        }
    }

    private _loadTocRootItems(publicationId: string, path?: string[]): Promise<ITaxonomy[]> {
        const { services } = this.context;
        // Get the data for the Toc
        this._toc.rootItems = undefined;
        this._toc.error = undefined;
        this.setState({
            activeTocItemPath: undefined,
            selectedTocItem: null,
            isTocLoading: true
        });

        return services.taxonomyService.getSitemapRoot(publicationId).then(
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
                return items;
            },
            error => {
                /* istanbul ignore else */
                if (!this._isUnmounted) {
                    this._toc.error = error;
                    this.setState({
                        isTocLoading: false
                    });
                }
            }
        );
    }

    private _navigateToOtherReleaseVersion(releaseVersion: string, logicalId?: string): void {
        const { onReleaseVersionChanged, onPageReleaseVersionChanged, publicationId, conditions } = this.props;

        if (logicalId && onPageReleaseVersionChanged) {
            const { services } = this.context;
            onPageReleaseVersionChanged(services.pageService, publicationId, releaseVersion, logicalId, conditions);
        } else if (onReleaseVersionChanged) {
            onReleaseVersionChanged(publicationId, releaseVersion);
        }
    }
}
