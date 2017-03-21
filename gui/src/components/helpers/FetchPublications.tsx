import * as React from "react";
import { connect } from "react-redux";
import { fetchPublications } from "store/actions/Api";
import { IAppContext } from "components/container/App";
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

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {
        const { publicationService } = this.context.services;
        if (this.props.fetch) {
            this.props.productFamily ?
                this.props.fetch(publicationService, this.props.productFamily) :
                this.props.fetch(publicationService);
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
