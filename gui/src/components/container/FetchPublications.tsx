import { fetchPublications } from "store/actions/Api";
import * as React from "react";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";

export interface IFetchPublications {
    fetch: () => void;
}

class Fetch extends React.Component<IFetchPublications, {}> {
    public componentWillMount(): void {
        console.log("Do we ever come here?");
        this.props.fetch();
    }

    public render(): JSX.Element {
        return (<div></div>);
    }
}

const mapStateToProps = (state: IState): {} => ({});

const mapDispatchToProps = {
    fetch: fetchPublications
};

export const FetchPublications = connect(mapStateToProps, mapDispatchToProps)(Fetch);