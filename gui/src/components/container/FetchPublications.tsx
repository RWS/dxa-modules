import { fetchPublications } from "store/actions/Api";
import * as React from "react";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { IAppContext } from "./App";
import { IPublicationService } from "services/interfaces/PublicationService";

export interface IFetchPublications {
    fetch: (publicationService: IPublicationService) => void;
}

class Fetch extends React.Component<IFetchPublications, {}> {
    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired
    }
    public context: IAppContext;
    public componentWillMount(): void {
        console.log("Do we ever come here?");
        const { publicationService } = this.context.services;
        this.props.fetch(publicationService);
    }

    public render(): JSX.Element {
        return (<div />);
    }
}

const mapStateToProps = (state: IState): {} => ({});

const mapDispatchToProps = {
    fetch: fetchPublications
};

export const FetchPublications = connect(mapStateToProps, mapDispatchToProps)(Fetch);