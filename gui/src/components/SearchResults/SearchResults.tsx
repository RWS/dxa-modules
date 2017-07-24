import * as React from "react";
import { ButtonPurpose } from "@sdl/controls";
import { ActivityIndicator, Button } from "@sdl/controls-react-wrappers";
import { Error } from "@sdl/dd/presentation/Error";
import { IAppContext } from "@sdl/dd/container/App/App";
import { ISearchQueryResult, ISearchQuery } from "interfaces/Search";
import { SearchResultItem } from "@sdl/dd/SearchResults/SearchResultItem";

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
    searchResults?: ISearchQueryResult[];

    /**
     * Search results hits
     *
     * @type {number}
     * @memberOf ISearchResultsState
     */
    searchResultsHits?: number;

    /**
     * Search results start index
     *
     * @type {number}
     * @memberOf ISearchResultsState
     */
    startIndex: number;
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
            searchResultsHits: 0,
            startIndex: 0,
            error: undefined
        };
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {
        const { publicationId, searchQuery } = this.props.params;
        const { startIndex } = this.state;
        const query = {
            publicationId,
            searchQuery,
            startIndex
        } as ISearchQuery;

        this._fetchSearchResults(query);
    }

    /**
     * Invoked immediately before rendering when new props or state are being received.
     * This method is not called for the initial render.
     *
     * @param {ISearchResultsProps} nextProps Next props
     * @param {ISearchResultsState} nextState Next state
     */
    public componentWillUpdate(nextProps: ISearchResultsProps, nextState: ISearchResultsState): void {
        const { publicationId, searchQuery } = this.props.params;
        const { startIndex } = this.state;
        const isNewSearch = (nextProps.params.searchQuery !== searchQuery) ||
            (nextProps.params.publicationId !== publicationId);
        if (isNewSearch ||
            (nextState.startIndex !== startIndex)) {
            this._fetchSearchResults({
                publicationId: nextProps.params.publicationId,
                searchQuery: nextProps.params.searchQuery,
                startIndex: isNewSearch ? 0 : nextState.startIndex
            } as ISearchQuery);
        }
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { searchQuery, publicationId } = this.props.params;
        const { searchResults, searchResultsHits, isLoading, error, startIndex } = this.state;
        const { formatMessage } = this.context.services.localizationService;
        const hits = searchResultsHits || 0;
        const query = {
            publicationId,
            searchQuery,
            startIndex
        } as ISearchQuery;
        const errorButtons = <div>
            <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{ "click": () => this._fetchSearchResults(query) }}>{formatMessage("control.button.retry")}</Button>
        </div>;

        return (
            <section className={"sdl-dita-delivery-search-results"}>
                <h1>{formatMessage("search.publication.results")} <strong>{searchQuery}</strong></h1>
                {isLoading && <ActivityIndicator skin="graphene" text={formatMessage("components.app.loading")} />}
                {error
                    ? <Error
                        title={formatMessage("error.default.title")}
                        messages={[formatMessage("error.publications.list.not.found"), formatMessage("error.publications.default.message")]}
                        buttons={errorButtons} />
                    : searchResults && (hits > 0)
                        ? <div className={"search-results-list"}>
                            <h4>{formatMessage("search.results.total", [hits.toString()])}</h4>
                            {
                                searchResults.map((x: ISearchQueryResult, i: number) => {
                                    return <SearchResultItem key={i} index={i} searchResult={x} />;
                                })
                            }
                            {(searchResults.length < hits) &&
                                <div className="search-results-buttons-wrapper">
                                    <Button
                                        skin="graphene"
                                        purpose={ButtonPurpose.GHOST}
                                        events={{
                                            "click": () => this.setState({
                                                startIndex: (startIndex || 0) + SHOWN_ITEMS_INCREMENT
                                            })
                                        }}>{formatMessage("search.results.more")}
                                    </Button>
                                    {formatMessage("search.results.shown", [searchResults.length.toString(), hits.toString()])}
                                </div>
                            }
                        </div>
                        : <div className={"search-results-list-empty"}>
                            {formatMessage("search.no.results")}
                            <ul>
                                <li>{formatMessage("search.no.results.spelling")}</li>
                                <li>{formatMessage("search.no.results.quotation")}</li>
                            </ul>
                        </div>
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
     * fetch search results
     */
    private _fetchSearchResults(query: ISearchQuery): void {
        const { searchService, localizationService } = this.context.services;
        const { searchResults } = this.state;

        this.setState({
            isLoading: true
        });

        // Get search results families list
        searchService.getSearchResults({
            ...query,
            locale: localizationService.getLanguage()
        }).then(
            result => {
                /* istanbul ignore else */
                if (!this._isUnmounted) {
                    this.setState({
                        isLoading: false,
                        searchResults: (result.startIndex === 0) ? result.queryResults : (searchResults || []).concat(...result.queryResults),
                        searchResultsHits: result.hits,
                        startIndex: result.startIndex,
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
}
