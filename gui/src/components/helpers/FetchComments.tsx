import * as React from "react";
import { connect } from "react-redux";
import { getCurrentPub } from "store/reducers/Reducer";
import { IAppContext } from "@sdl/dd/container/App/App";
import { IState } from "store/interfaces/State";
import { fetchComments as fetchCommentsApi } from "store/actions/Api";
import { IPageService } from "services/interfaces/PageService";

export interface ICommentsFetcher {
    publicationId: string;
    pageId: string;
    fetch: (pageService: IPageService, publicationId: string, pageId: string, descending: boolean, top: number, skip: number, status: number[]) => void;
};

export interface ICommentProperties {
    descending: boolean;
    top: number;
    skip: number;
    status: number[];
};

/**
 * Fetch page component
 */
class Fetch extends React.Component<ICommentsFetcher & ICommentProperties, {}> {

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
     * Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
     */
    public componentDidMount(): void {
        this.fetchComments();
    }

    /**
     * Invoked immediately after the component's updates are flushed to the DOM. This method is not called for the initial render.
     */
    public shouldComponentUpdate(nextProps: ICommentsFetcher): boolean {
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

        this.props.fetch(pageService, publicationId, pageId, descending, top, skip, status);
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

//==
// Connect Comments Fetcher to redux state
//==
const mapStateToProps = (state: IState, ownProps: ICommentProperties) => ({
    publicationId: getCurrentPub(state).publicationId,
    pageId: getCurrentPub(state).pageId
});

const mapDispatchToProps = {
    fetch: fetchCommentsApi
};

const CommentsFetcher = connect(mapStateToProps, mapDispatchToProps)(Fetch);

export default CommentsFetcher;
