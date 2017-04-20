import * as React from "react";
import { connect } from "react-redux";
import { fetchPage } from "store/actions/Api";
import { getCurrentPub } from "store/reducers/Reducer";
import { IAppContext } from "@sdl/dd/containers/app";
import { IPageService } from "services/interfaces/PageService";
import { IState, IPublicationCurrentState } from "store/interfaces/State";

export interface IFetchPage {
    /**
     * Fetch Page function following type to load the page
     *     @param   {IPageService}
     *     @param   {string}
     *     @param   {string}
     *     @returns {void}
     *
     * @memberOf IFetchPage
     */
    fetch: (pageService: IPageService, publicationId: string, pageId: string) => void;
    /**
     * Current publication from Global State
     *
     * @type {IPublicationCurrentState}
     * @memberOf IFetchPage
     */
    currentPub: IPublicationCurrentState;
};

/**
 * Fetch page component
 */
class Fetch extends React.Component<IFetchPage, {}> {
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
        this.fetchCurrentPage();
    }

    /**
     * Invoked immediately after the component's updates are flushed to the DOM. This method is not called for the initial render.
     */
    public shouldComponentUpdate(nextProps: IFetchPage): boolean {
        return this.props.currentPub.pageId !== nextProps.currentPub.pageId;
    }

    /**
     * Invoked immediately after updating.
     */
    public componentDidUpdate(): void {
        this.fetchCurrentPage();
    }

    /**
     * Get parameters and execute fetch function
     */
    public fetchCurrentPage(): void {
        const { publicationId, pageId } = this.props.currentPub;
        const { pageService } = this.context.services;
        if (pageId !== "") {
            this.props.fetch(pageService, publicationId, pageId);
        }
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return (<div />);
    }
}

const mapStateToProps = (state: IState): {} => ({
    currentPub: getCurrentPub(state)
});

const mapDispatchToProps = {
    fetch: fetchPage
};

/**
 * Connector of Fetch Page component for Redux
 *
 * @export
 */
export const FetchPage = connect(mapStateToProps, mapDispatchToProps)(Fetch);