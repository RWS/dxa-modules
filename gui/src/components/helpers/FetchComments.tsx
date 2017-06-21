import * as React from "react";
import { connect } from "react-redux";
import { getCurrentPub } from "store/reducers/Reducer";
import { IAppContext } from "@sdl/dd/container/App/App";
import { IState } from "store/interfaces/State";
import { fetchComments as fetchCommentsApi } from "store/actions/Api";
import { IPageService } from "services/interfaces/PageService";

export interface IFetchComments {
    publicationId: string;
    pageId: string;
    fetch: (pageService: IPageService, publicationId: string, pageId: string, descending: boolean, top: number, skip: number, status: number[]) => void;
};

export interface IFetchCommentsProperties {
    /**
     * Sorting type (NOTE: sort by comment id)
     * Default value: false
     *
     * @type {boolean}
     * @memberof IFetchCommentsProperties
     */
    descending?: boolean;
    /**
     * Amount of comments to be retrieved
     * Default value: 0 (all comments)
     *
     * @type {number}
     * @memberof IFetchCommentsProperties
     */
    top?: number;
    /**
     * Amount of comments to be skipped
     * Default value: 0
     * NOTE: if you set Top property, the skip property will be ignored and vise versa
     *
     * @type {number}
     * @memberof IFetchCommentsProperties
     */
    skip?: number;
    /**
     * Status of comments
     * Default value: 0
     * Possible values: 0 - Submitted, 1 - FlaggedForModeration, 2 - Posted, 3 - Rejected, 4 - FlaggedForDeletion, 5 - Resubmitted
     *
     * @type {number[]}
     * @memberof IFetchCommentsProperties
     */
    status?: number[];
};

export const CommentStatus = {
    SUBMITTED: 0,
    FLAGGED_FOR_MODERATION: 1,
    POSTED: 2,
    REJECTED: 3,
    FLAGGED_FOR_DELETION: 4,
    RESUBMITTED: 5
};

/**
 * Fetch page component
 */
class Fetch extends React.Component<IFetchComments & IFetchCommentsProperties, {}> {

    /**
     * Context types
     */
    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired
    };

    /**
     * Global context
     */
    public context: IAppContext;

    /**
     * Default values
     *
     * @returns {IFetchCommentsProperties}
     *
     * @memberof Fetch
     */
    public defaultProps: IFetchCommentsProperties = {
        descending: false,
        top: 0,
        skip: 0,
        status: [CommentStatus.SUBMITTED]
    };

    /**
     * Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
     */
    public componentDidMount(): void {
        this.fetchComments();
    }

    /**
     * Invoked immediately after the component's updates are flushed to the DOM. This method is not called for the initial render.
     */
    public shouldComponentUpdate(nextProps: IFetchComments): boolean {
        return this.props.pageId !== nextProps.pageId;
    }

    /**
     * Invoked immediately after updating.
     */
    public componentDidUpdate(): void {
        this.fetchComments();
    }

    /**
     * Get parameters and execute fetch function
     */
    public fetchComments(): void {
        const { pageId, publicationId, descending, top, skip, status } = this.props;
        const { pageService } = this.context.services;

        this.props.fetch(pageService, publicationId, pageId, descending as boolean, top as number, skip as number, status as number[]);
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return (<div className="sdl-comments-fetcher" />);
    }
}

/**
 * Connect Comments Fetcher to redux state
 *
 * @param {IState} state
 * @param {IFetchCommentsProperties} ownProps
 */
const mapStateToProps = (state: IState, ownProps: IFetchCommentsProperties) => ({
    publicationId: getCurrentPub(state).publicationId,
    pageId: getCurrentPub(state).pageId
});

const mapDispatchToProps = {
    fetch: fetchCommentsApi
};

const FetchComments = connect(mapStateToProps, mapDispatchToProps)(Fetch);

export default FetchComments;
