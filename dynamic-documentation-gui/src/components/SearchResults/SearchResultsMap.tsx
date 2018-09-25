import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { SearchResults, ISearchResultsProps } from "@sdl/dd/SearchResults/SearchResults";

const mapStateToProps = (state: IState, ownProps: ISearchResultsProps) => {
    const { params } = ownProps;
    return {
        params,
        locale: state.language
    };
};

/**
 * Connector of Publication List component for Redux
 *
 * @export
 */
export const SearchResultsMap = connect(mapStateToProps)(SearchResults);
