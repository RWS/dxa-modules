import * as React from "react";
import { connect } from "react-redux";
import { fetchProductReleaseVersions } from "store/actions/Api";
import { IAppContext } from "@sdl/dd/container/App/App";
import { IPublicationService } from "services/interfaces/PublicationService";
import { IState } from "store/interfaces/State";
import { getCurrentPub } from "store/reducers/Reducer";

export interface IFetchProductRelease {
    /**
     * Fetch Publication function following type to load publications
     *     @param   {IPublicationService}
     *     @param   {string}
     *     @returns {void}
     *
     * @memberOf IFetchPublications
     */
    fetch: (publicationService: IPublicationService, publicationId: string) => void;
    /**
     * Current product family
     *
     * @param {string}
     * @memberOf IFetchPublications
     */
    publicationId: string;
}

/**
 * Fetch publications component
 */
class Fetch extends React.Component<IFetchProductRelease, {}> {
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
    public componentDidMount(): void {
        this.fetchReleaseVersions(this.props);
    }

    public shouldComponentUpdate(nextProps: IFetchProductRelease): boolean {
        return this.props.publicationId !== nextProps.publicationId;
    }

    public componentDidUpdate(): void {
        this.fetchReleaseVersions(this.props);
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return (<div />);
    }
    private fetchReleaseVersions(props: IFetchProductRelease): void {
        const { publicationService } = this.context.services;

        if (props.fetch && props.publicationId) {
            props.fetch(publicationService, props.publicationId);
        }
    }
}

const mapStateToProps = (state: IState): {} => ({
    publicationId: getCurrentPub(state).publicationId
});

const mapDispatchToProps = {
    fetch: fetchProductReleaseVersions
};

/**
 * Connector of Fetch Publications component for Redux
 *
 * @export
 */
export const FetchProductReleaseVersions = connect(mapStateToProps, mapDispatchToProps)(Fetch);
