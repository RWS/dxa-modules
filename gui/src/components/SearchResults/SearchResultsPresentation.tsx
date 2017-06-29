import * as React from "react";
// import { Promise } from "es6-promise";
// import { Link } from "react-router";
import { ButtonPurpose } from "@sdl/controls";
import { ActivityIndicator, Button } from "@sdl/controls-react-wrappers";

import { Error } from "@sdl/dd/presentation/Error";

import { IAppContext } from "@sdl/dd/container/App/App";
// import { Url } from "utils/Url";

import { ISearchResult } from "interfaces/Search";
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

    /**
     * Search results
     * @type {ISearchResult[]}
     * @interface ISearchResultsProps
     */
    searchResults: ISearchResult[];

    /**
     * List of all publications
     * @type {boolean}
     * @interface ISearchResultsProps
     */
    isLoading: boolean;

    /**
     * An error prevented the list from loading
     *
     * @type {string}
     * @memberOf ISearchResultsState
     */
    error: string;

    /**
     * Fetch search results method
     * @interface ISearchResultsProps
     */
    //fetchSearchResults?: (searchService: ISearchService, publicationId: string, searchQuery: string) => void;
}


/**
 * Publications list component
 */
export const SearchResultsPresentation: React.StatelessComponent<ISearchResultsProps> = (props: ISearchResultsProps, context: IAppContext): JSX.Element => {
    const { searchResults, isLoading, error } = props;
    const { services } = context;
    const { formatMessage } = services.localizationService;
    const _retryHandler = (): void => { };
    const errorButtons = <div>
        <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{ "click": _retryHandler }}>{formatMessage("control.button.retry")}</Button>
    </div>;
    return (
        <section className={"sdl-dita-delivery-search-results"}>
            <h1>{formatMessage("search.results", ["Pub Title"])}</h1>
            <h4>{formatMessage("search.results.total", [searchResults.length.toString()])}</h4>
            {error
                ? <Error
                    title={formatMessage("error.default.title")}
                    messages={[formatMessage("error.publications.list.not.found"), formatMessage("error.publications.default.message")]}
                    buttons={errorButtons} />
                : !isLoading
                    ? searchResults.length > 0
                        ? <ul className="seach-results">{
                            searchResults.map((x: ISearchResult, i: number) => {
                                return <li key={i}>
                                    <h2>{x.id} + Page Title</h2>
                                    <nav>
                                        <a href="">{x.id} + Product Family</a>
                                        <a href="">{x.id} + Release Version</a>
                                        <a href="">{x.id} + Publication Title</a>
                                    </nav>
                                    <p>{x.content}</p>
                                    <span>{x.id} + last modified date &emsp; {x.id} + Language</span>
                                </li>;
                            })}
                        </ul>
                        : <div className={"no-available-publications-label"}>{formatMessage("components.productfamilies.no.published.publications")}</div>
                    : <ActivityIndicator skin="graphene" text={formatMessage("components.app.loading")} />
            }
        </section>);
}

SearchResultsPresentation.contextTypes = {
    services: React.PropTypes.object.isRequired
} as React.ValidationMap<IAppContext>;
