import * as React from "react";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { Url } from "utils/Url";
import { getPubById, getPageById } from "store/reducers/Reducer";
import { isDummyPage } from "utils/Page";
export interface IPageLinkPresentationProps {
    publicationId: string;
    pageId?: string;

    pageTitle?: string;

    publicationTitle?: string;

    url?: string;
    children?: JSX.Element[];
};

export const PageLinkPresentation = (props: IPageLinkPresentationProps): JSX.Element => {
   return <a href={props.url} title={props.pageTitle || props.publicationTitle}>{props.children}</a>;
};

const mapStateToProps = (state: IState, ownProps: IPageLinkPresentationProps): IPageLinkPresentationProps => {
    const publication = getPubById(state, ownProps.publicationId);
    const page = getPageById(state, ownProps.pageId || "fake");
    const publicationTitle = publication.title;
    const pageTitle = isDummyPage(page) ? page.title : "";

    return {
        url: !ownProps.pageId ? Url.getPublicationUrl(publication.id, publicationTitle) : Url.getPageUrl(publication.id, page.id, publicationTitle, pageTitle),
        publicationTitle,
        pageTitle,
        ...ownProps
    };
};

export const PageLink = connect(mapStateToProps)(PageLinkPresentation);