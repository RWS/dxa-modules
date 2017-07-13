import * as React from "react";
import { ButtonPurpose } from "@sdl/controls";
import { ActivityIndicator, Button } from "@sdl/controls-react-wrappers";
import { Error } from "@sdl/dd/presentation/Error";
import { IAppContext } from "@sdl/dd/container/App/App";
import { ISearchQueryResults, ISearchQueryResult, ISearchQuery } from "interfaces/Search";
import { Url } from "utils/Url";

import "components/controls/styles/ActivityIndicator";
import "./SearchResults.less";

const SHOWN_ITEMS_INCREMENT = 10;

/**
 *  Search results component props params
 *
 * @export
 * @interface ISearchResultsPropsParams
 */
export interface ISearchResultsPropsParams {
    /**
     * PublicationId
     *
     * @type {string}
     * @memberOf ISearchResultsPropsParams
     */
    publicationId: string;
    /**
     * Seqrch query
     *
     * @type {string}
     */
    searchQuery: string;
}

/**
 * Search results component props
 *
 * @export
 * @interface ISearchResultsProps
 */
export interface ISearchResultsProps {
    /**
     * Search resultst props parameters
     *
     * @type {ISearchResultsPropsParams}
     * @interface ISearchResultsProps
     */
    params: ISearchResultsPropsParams;
}

/**
 * Search results component state
 *
 * @export
 * @interface ISearchResultsState
 */
export interface ISearchResultsState {
    /**
     * Search resultst error message
     *
     * @type {string}
     * @interface ISearchResultsState
     */
    error?: string;

    /**
     * Is search results list loading
     * @type {boolean}
     * @interface ISearchResultsState
     */
    isLoading?: boolean;

    /**
     * Search results list
     *
     * @type {ISearchQueryResults}
     * @memberOf ISearchResultsState
     */
    searchResults?: ISearchQueryResults;

    /**
     * Search results start index
     *
     * @type {number}
     * @memberOf ISearchResultsState
     */
    startIndex?: number;
}

/**
 * Search results component
 */
export class SearchResults extends React.Component<ISearchResultsProps, ISearchResultsState> {

    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired
    };

    public context: IAppContext;

    private _isUnmounted: boolean = false;

    /**
     * Creates an instance of Product families list component.
     *
     */
    constructor() {
        super();
        this.state = {
            isLoading: undefined,
            searchResults: undefined,
            startIndex: 0,
            error: undefined
        };
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {
        this._fetchSearchResults();
    }

    /**
     * Invoked immediately before rendering when new props or state are being received.
     * This method is not called for the initial render.
     *
     * @param {ISearchResultsProps} nextProps Next props
     */
    public componentWillUpdate(nextProps: ISearchResultsProps, nextState: ISearchResultsState): void {
        const { publicationId, searchQuery } = this.props.params;
        const { startIndex } = this.state;
        if ((nextProps.params.searchQuery !== searchQuery) ||
            (nextProps.params.publicationId !== publicationId) ||
            (nextState.startIndex !== startIndex)) {
            this._fetchSearchResults();
        }
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { searchQuery } = this.props.params;
        const { searchResults, isLoading, error, startIndex } = this.state;
        const { formatMessage } = this.context.services.localizationService;
        const errorButtons = <div>
            <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{ "click": () => this._fetchSearchResults() }}>{formatMessage("control.button.retry")}</Button>
        </div>;

        return (
            <section className={"sdl-dita-delivery-search-results"}>
                <h1>{formatMessage("search.publication.results", [searchQuery])}</h1>
                {
                    error
                        ? <Error
                            title={formatMessage("error.default.title")}
                            messages={[formatMessage("error.publications.list.not.found"), formatMessage("error.publications.default.message")]}
                            buttons={errorButtons} />
                        : (!isLoading && searchResults)
                            ? <div className={"search-results-list"}>
                                <h4>{formatMessage("search.results.total", [searchResults.hits.toString()])}</h4>
                                <ul>
                                    {searchResults.queryResults.map((x: ISearchQueryResult, i: number) => this._renderSearchResult(i, x))}
                                </ul>
                                {!(searchResults.queryResults.length < (searchResults.hits || 0)) &&
                                    <div>
                                        <Button
                                            skin="graphene"
                                            purpose={ButtonPurpose.GHOST}
                                            events={{
                                                "click": () => this.setState({
                                                    startIndex: (startIndex || 0) + SHOWN_ITEMS_INCREMENT
                                                })
                                            }}>{formatMessage("search.results.more")}
                                        </Button>
                                        {formatMessage("search.results.shown", [searchResults.queryResults.length.toString(), searchResults.hits.toString()])}
                                    </div>
                                }
                            </div>
                            : <ActivityIndicator skin="graphene" text={formatMessage("components.app.loading")} />
                }
            </section>);
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount(): void {
        this._isUnmounted = true;
    }

    /**
     * Render the search result
     *
     * @returns {JSX.Element}
     */
    private _renderSearchResult(i: number, searchResult: ISearchQueryResult): JSX.Element {
        const { formatMessage } = this.context.services.localizationService;
        const modifiedDate = searchResult.lastModifiedDate && new Date(searchResult.lastModifiedDate).toLocaleString();
        return <li key={i} tabIndex={i}>
            <h3>{searchResult.pageTitle}<button title={formatMessage("search.results.bookmark")} onClick={() => this._addToBookmarks(
                Url.getPageUrl(searchResult.publicationId, searchResult.pageId, searchResult.publicationTitle, searchResult.pageTitle),
                searchResult.pageTitle)} /></h3>
            <nav>
                {searchResult.productFamilyTitle &&
                    <a href={Url.getProductFamilyUrl(searchResult.productFamilyTitle, searchResult.productReleaseVersionTitle)}>{searchResult.productFamilyTitle}</a>}
                {searchResult.productFamilyTitle && searchResult.productReleaseVersionTitle &&
                    <a href={Url.getProductFamilyUrl(searchResult.productFamilyTitle, searchResult.productReleaseVersionTitle)}>{searchResult.productReleaseVersionTitle}</a>}
                <a href={Url.getPageUrl(searchResult.publicationId, searchResult.pageId, searchResult.publicationTitle, searchResult.pageTitle)}>{searchResult.pageTitle}</a>
            </nav>
            <p>{searchResult.content}</p>
            <span>{
                `${formatMessage("search.result.last.updated", [modifiedDate || ""])}`
            } &emsp; {
                    `${formatMessage("search.result.language", [searchResult.language || ""])}`
                }</span>
        </li>;
    }

    /**
     * fetch search results
     */
    private _fetchSearchResults(): void {
        const { publicationId, searchQuery } = this.props.params;
        const { startIndex } = this.state;
        const { searchService } = this.context.services;

        this.setState({
            isLoading: true
        });

        // Get search results families list
        searchService.getSearchResults({
            publicationId,
            searchQuery,
            startIndex
        } as ISearchQuery).then(
            searchResults => {
                /* istanbul ignore else */
                if (!this._isUnmounted) {
                    this.setState({
                        isLoading: false,
                        searchResults: searchResults,
                        error: undefined
                    });
                }
            },
            error => {
                /* istanbul ignore else */
                if (!this._isUnmounted) {
                    // TODO: improve error handling
                    this.setState({
                        isLoading: false,
                        error: error
                    });
                }
            });
    }

    /**
     * Add to bookmarks
     */
    private _addToBookmarks(url: string, title: string): void {
        // there is no nice crossbrowser solution.
        console.log("Add to bookmark");
    }
}
