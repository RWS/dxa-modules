import * as React from "react";
import { connect } from "react-redux";
import { IState, IPublicationCurrentState } from "store/interfaces/State";
import { fetchPage } from "store/actions/Api";
import { getCurrentPub } from "store/reducers/Reducer";
import { IAppContext } from "components/container/App";
import { IPageService } from "services/interfaces/PageService";

export interface IFetchPage {
    fetch: (pageService: IPageService,publicationId: string, pageId: string) => void;
    currentPub: IPublicationCurrentState;
};

class Fetch extends React.Component<IFetchPage & IPublicationCurrentState, {}> {
   public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired
    }
    public context: IAppContext;
    public componentDidMount(): void {
        console.log("Do we ever come here?");
        this.fetchCurrentPage();
    }

    public shouldComponentUpdate(nextProps: IFetchPage & IPublicationCurrentState): boolean {
        return (nextProps.currentPub.pageId !== "") && (this.props.currentPub.pageId !== nextProps.currentPub.pageId);
    }

    public componentDidUpdate(): void {
        this.fetchCurrentPage();
    }

    public fetchCurrentPage(): void {
        const { publicationId, pageId } = this.props.currentPub;
        const { pageService } = this.context.services;
        console.log("fetchCurrentPage", publicationId, pageId);
        this.props.fetch(pageService, publicationId, pageId);
    }

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

export const FetchPage = connect(mapStateToProps, mapDispatchToProps)(Fetch);