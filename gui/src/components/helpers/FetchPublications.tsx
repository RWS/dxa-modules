import { fetchPublications } from "store/actions/Api";
import * as React from "react";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { IAppContext } from "components/container/App";
import { IPublicationService } from "services/interfaces/PublicationService";

export interface IFetchPublications {
    productFamily?: string;
    fetch?: (publicationService: IPublicationService, productFamily?: string) => void;
}

class Fetch extends React.Component<IFetchPublications, {}> {
    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired
    };
    public context: IAppContext;
    public componentWillMount(): void {
        const { publicationService } = this.context.services;
        if (this.props.fetch) {
            this.props.productFamily ?
                this.props.fetch(publicationService, this.props.productFamily) :
                this.props.fetch(publicationService);
        }
    }

    public render(): JSX.Element {
        return (<div />);
    }
}

const mapStateToProps = (state: IState, ownProps: IFetchPublications): {} => ({});

const mapDispatchToProps = {
    fetch: fetchPublications
};

export const FetchPublications = connect(mapStateToProps, mapDispatchToProps)(Fetch);
