import * as React from "react";
import { connect } from "react-redux";
import { fetchPublications } from "store/actions/Api";
import { IAppContext } from "@sdl/dd/container/App/App";
import { IPublicationService } from "services/interfaces/PublicationService";
import { IState } from "store/interfaces/State";

export interface IFetchPublications {
    /**
     * Fetch Publication function following type to load publications
     *     @param   {IPublicationService}
     *     @param   {string}
     *     @returns {void}
     *
     * @memberOf IFetchPublications
     */
    fetch?: (publicationService: IPublicationService, productFamily?: string) => void;
    /**
     * Current product family
     *
     * @param {string}
     * @memberOf IFetchPublications
     */
    productFamily?: string;
}

/**
 * Fetch publications component
 */
class Fetch extends React.Component<IFetchPublications, {}> {
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

    public shouldComponentUpdate(nextProps: IFetchPublications): boolean {
        return this.props.productFamily !== nextProps.productFamily;
    }
    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {
        this.fetchPublications(this.props);
    }

    public componentDidUpdate(): void {
        this.fetchPublications(this.props);
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return (<div />);
    }

    private fetchPublications(props: IFetchPublications): void {
        const { publicationService } = this.context.services;
        if (this.props.fetch) {
            this.props.fetch(publicationService, this.props.productFamily);
        }
    }
}

const mapStateToProps = (state: IState, ownProps: IFetchPublications): {} => ({});

const mapDispatchToProps = {
    fetch: fetchPublications
};

/**
 * Connector of Fetch Publications component for Redux
 *
 * @export
 */
export const FetchPublications = connect(mapStateToProps, mapDispatchToProps)(Fetch);
