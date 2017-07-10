import * as React from "react";
// import { Promise } from "es6-promise";
// import { Link } from "react-router";
import { ButtonPurpose } from "@sdl/controls";
import { ActivityIndicator, Button } from "@sdl/controls-react-wrappers";

import { Error } from "@sdl/dd/presentation/Error";

import { IAppContext } from "@sdl/dd/container/App/App";
// import { Url } from "utils/Url";

import { ISearchResult, ISearchQuery } from "interfaces/Search";
//import { ISearchService } from "services/interfaces/SearchService";

import "components/controls/styles/ActivityIndicator";
import "./SearchResults.less";

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
     * @type {ISearchResult[]}
     * @memberOf ISearchResultsState
     */
    searchResults?: ISearchResult[];

    /**
     * Search results hits
     *
     * @type {number}
     * @memberOf ISearchResultsState
     */
    searchResultsHits?: number;
}

/**
 * Search results component
 */
export class SearchResults extends React.Component<ISearchResultsProps, ISearchResultsState> {

    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired,
        router: React.PropTypes.object.isRequired
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
            searchResultsHits: 100,
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
    public componentWillUpdate(nextProps: ISearchResultsProps): void {
        if (nextProps.params.searchQuery !== this.props.params.searchQuery) {
            this._fetchSearchResults();
        }
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { publicationId } = this.props.params;
        const { searchResults, searchResultsHits, isLoading, error } = this.state;
        const { formatMessage } = this.context.services.localizationService;
        const errorButtons = <div>
            <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{ "click": () => this._fetchSearchResults() }}>{formatMessage("control.button.retry")}</Button>
        </div>;

        return (
            <section className={"sdl-dita-delivery-search-results"}>
                <h1>{
                    publicationId
                        ? formatMessage("search.publication.results", ["" + publicationId])
                        : formatMessage("search.results")
                }</h1>
                {
                    error
                        ? <Error
                            title={formatMessage("error.default.title")}
                            messages={[formatMessage("error.publications.list.not.found"), formatMessage("error.publications.default.message")]}
                            buttons={errorButtons} />
                        : (!isLoading && searchResults)
                            ? <div className={"search-results-list"}>
                                <h4>{formatMessage("search.results.total", [searchResults.length.toString()])}</h4>
                                <ul>
                                    {searchResults.map((x: ISearchResult, i: number) => this._renderSearchResult(i, x))}
                                </ul>
                                <div>
                                    <Button
                                        skin="graphene"
                                        purpose={ButtonPurpose.GHOST}
                                        events={{"click": () => {

                                        }}}>{formatMessage("search.results.more")}
                                    </Button>
                                    {formatMessage("search.results.shown", [searchResults.length.toString(), (searchResultsHits || 0).toString()])}
                                </div>
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
    private _renderSearchResult(i: number, searchResult: ISearchResult): JSX.Element {
        const { formatMessage } = this.context.services.localizationService;
        const modifiedDate = searchResult.lastModifiedDate && new Date(searchResult.lastModifiedDate).toLocaleString(/*getLanguage(), options*/);
        return <li key={i} tabIndex={i}>
            <h3>{searchResult.pageTitle}<button title={formatMessage("search.results.bookmark")} onClick={() => this._addToBookmarks() }/></h3>
            <nav>
                <a href="">{searchResult.productFamilyTitle}</a>
                <a href="">{searchResult.productReleaseVersionTitle}</a>
                <a href="">{searchResult.pageTitle}</a>
            </nav>
            <p>{[...Array(20)].join(searchResult.content + " ")}</p>
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
        const { searchService } = this.context.services;

        this.setState({
            isLoading: true
        });

        // Get search results families list
        searchService.getSearchResults({
            publicationId,
            searchQuery
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
     * fetch search results
     */
    private _addToBookmarks(): void {
        alert("Add to bookmarks");
    }
}
