import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { getCurrentPub, getSearchBySearchQuery, getSearchErrorMessage, isSearchLoading } from "store/reducers/Reducer";
import { ISearchQuery } from "interfaces/Search";
//import { fetchSearchResults } from "store/actions/Api";

import { SearchResultsPresentation, ISearchResultsProps } from "@sdl/dd/SearchResults/SearchResultsPresentation";

const mapStateToProps = (state: IState, ownProps: ISearchResultsProps) => {
    const { params } = ownProps;
    const { publicationId } = getCurrentPub(state);
    const query = {
        publicationId,
        searchQuery: params.searchQuery,
        language: state.language
    } as ISearchQuery;

    const searchResults = getSearchBySearchQuery(state, query);
    const isLoading = isSearchLoading(state, query);
    const error = getSearchErrorMessage(state, query);

    return {
        searchResults,
        isLoading,
        error
    };
};

// const dispatchToProps = {
//     fetchSearchResults
// };

/**
 * Connector of Search result component for Redux
 *
 * @export
 */
export const SearchResults = connect(mapStateToProps)(SearchResultsPresentation);
