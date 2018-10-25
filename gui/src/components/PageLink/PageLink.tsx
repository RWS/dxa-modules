import * as React from "react";
import { connect } from "react-redux";
import { Url } from "utils/Url";
import { getPubById, getPageById } from "store/reducers/Reducer";
import { IState } from "store/interfaces/State";
import { isDummyPage } from "utils/Page";

/**
 * Page link props
 *
 * @export
 * @interface IPageLinkPresentationProps
 */
export interface IPageLinkPresentationProps {
    /**
     * Current publication id
     *
     * @type {string}
     * @memberOf IPageLinkPresentationProps
     */
    publicationId: string;
    /**
     * Current page id
     *
     * @type {string}
     * @memberOf IPageLinkPresentationProps
     */
    pageId?: string;
    /**
     * Current page title
     *
     * @type {[type]}
     * @memberOf IPageLinkPresentationProps
     */
    pageTitle?: string;
    /**
     * Current publication title
     *
     * @type {[type]}
     * @memberOf IPageLinkPresentationProps
     */
    publicationTitle?: string;
    /**
     * Current URL
     *
     * @type {[type]}
     * @memberOf IPageLinkPresentationProps
     */
    url?: string;
    /**
     * List of current component children
     *
     * @type {[type]}
     * @memberOf IPageLinkPresentationProps
     */
    children?: JSX.Element;
};

/**
 * Page Link component
 */
export const PageLinkPresentation = (props: IPageLinkPresentationProps): JSX.Element => {
    return <a href={props.url} title={props.pageTitle || props.publicationTitle}>{props.children}</a>;
};

const mapStateToProps = (state: IState, ownProps: IPageLinkPresentationProps): IPageLinkPresentationProps => {
    const publication = getPubById(state, ownProps.publicationId);
    const page = getPageById(state, publication.id, ownProps.pageId || "fake");
    const publicationTitle = publication.title;
    const pageTitle = isDummyPage(page) ? "" : page.title;

    return {
        url: !ownProps.pageId ? Url.getPublicationUrl(publication.id, publicationTitle) : Url.getPageUrl(publication.id, page.id, publicationTitle, pageTitle),
        publicationTitle,
        pageTitle,
        ...ownProps
    };
};

/**
 * Connector of Page Link component for Redux
 *
 * @export
 */
export const PageLink = connect(mapStateToProps)(PageLinkPresentation);