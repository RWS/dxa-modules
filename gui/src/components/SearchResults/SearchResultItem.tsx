import * as React from "react";
import * as PropTypes from "prop-types";
import { IAppContext } from "@sdl/dd/container/App/App";
import { ISearchQueryResult } from "interfaces/Search";

import { Url } from "utils/Url";
import { Link } from "react-router";

import "./SearchResultItem.less";

/**
 * SearchResultItem props
 *
 * @export
 * @interface ISearchResultItemProps
 */
export interface ISearchResultItemProps {
    index?: number;
    searchResult: ISearchQueryResult;
}

/**
 * SearchResultItem
 */
export const SearchResultItem: React.StatelessComponent<ISearchResultItemProps> =
    (props: ISearchResultItemProps, context: IAppContext): JSX.Element => {

        /**
         * Add to bookmarks
         */
        function _addToBookmarks(url: string, title: string): void {
            // there is no nice crossbrowser solution.
            console.log("Add to bookmark url: " + url);
        }

        const { searchResult } = props;
        const { localizationService } = context.services;
        const { formatMessage, getLanguage } = localizationService;

        let bottomInfo: string[] = [];
        const modifiedDate = searchResult.lastModifiedDate;
        if (modifiedDate) {
            bottomInfo.push(`${formatMessage("search.result.last.updated", [modifiedDate.toLocaleDateString(getLanguage())])}`);
        }

        const language = localizationService.getLanguages().filter(x => x.iso == searchResult.language)[0];
        if (language && language.name) {
            bottomInfo.push(`${formatMessage("search.result.language", [language.name])}`);
        }

        return (
            <div className="sdl-dita-delivery-search-result-item" tabIndex={props.index}>
                <h3>
                    <Link title={searchResult.pageTitle}
                        to={Url.getPageUrl(searchResult.publicationId, searchResult.pageId, searchResult.publicationTitle, searchResult.pageTitle)}>
                        {searchResult.pageTitle}
                    </Link>
                    <button title={formatMessage("search.results.bookmark")} onClick={() => _addToBookmarks(
                        Url.getPageUrl(searchResult.publicationId, searchResult.pageId, searchResult.publicationTitle, searchResult.pageTitle),
                        searchResult.pageTitle)} />
                </h3>
                <nav>
                    {searchResult.productFamilyTitle &&
                        <Link title={searchResult.productFamilyTitle}
                            to={Url.getProductFamilyUrl(searchResult.productFamilyTitle, searchResult.productReleaseVersionTitle)}>
                            {searchResult.productFamilyTitle}
                        </Link>
                    }
                    {searchResult.productFamilyTitle && searchResult.productReleaseVersionTitle &&
                        <Link title={searchResult.productReleaseVersionTitle}
                            to={Url.getProductFamilyUrl(searchResult.productFamilyTitle, searchResult.productReleaseVersionTitle)}>
                            {searchResult.productReleaseVersionTitle}
                        </Link>
                    }
                    <Link title={searchResult.publicationTitle}
                        to={Url.getPublicationUrl(searchResult.publicationId, searchResult.publicationTitle)}>
                        {searchResult.publicationTitle}
                    </Link>
                </nav>
                <p>{searchResult.content}</p>
                {bottomInfo.map((x, i) => <span key={i}>{x}</span>)}
            </div>);
    };

SearchResultItem.contextTypes = {
    services: PropTypes.object.isRequired
} as React.ValidationMap<IAppContext>;
