import * as React from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentPub } from "store/reducers/Reducer";
import { IAppContext } from "@sdl/dd/container/App/App";
import { IState } from "store/interfaces/State";
import { fetchConditions } from "store/actions/Api";
import { IPublicationService } from "services/interfaces/PublicationService";

export interface IConditionsFetcher {
    pubId: string;
    fetch: (pubService: IPublicationService, pubId: string) => void;
};

/**
 * Fetch page component
 */
class Fetch extends React.Component<IConditionsFetcher, {}> {

    /**
     * Context types
     */
    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: PropTypes.object.isRequired
    };

    /**
     * Global context
     */
    public context: IAppContext;

    /**
     * Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
     */
    public componentDidMount(): void {
        this.fetchConditions();
    }

    /**
     * Invoked immediately after the component's updates are flushed to the DOM. This method is not called for the initial render.
     */
    public shouldComponentUpdate(nextProps: IConditionsFetcher): boolean {
        return this.props.pubId !== nextProps.pubId;
    }

    /**
     * Invoked immediately after updating.
     */
    public componentDidUpdate(): void {
        this.fetchConditions();
    }

    /**
     * Get parameters and execute fetch function
     */
    public fetchConditions(): void {
        const { pubId } = this.props;
        const { publicationService } = this.context.services;
        this.props.fetch(publicationService, pubId);
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return (<div className="sdl-conditions-fetcher" />);
    }
}

//==
// Connect ConditionsFetcher to redux state
//==
const mapStateToProps = (state: IState) => ({
    pubId: getCurrentPub(state).publicationId
});

const mapDispatchToProps = {
    fetch: fetchConditions
};

const ConditionsFetcher = connect(mapStateToProps, mapDispatchToProps)(Fetch);

export default ConditionsFetcher;
