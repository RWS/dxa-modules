import * as React from "react";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { IPublicationContentPropsParams } from "./PublicationContentX";
import { publicationRouteChanged } from "store/actions/Actions";
import { browserHistory } from "react-router";
import { Url } from "utils/Url";

export interface IPublication {
   publicationId: string;
    pageId: string;
}

export type Pub = {
        publicationId: string,
        pageId: string
    };
export interface ISyncParams {
    /**
     * Publications list content props parameters
     *
     * @type {IPublicationsListPropsParams}
     */
    publicationId: string;
    pageId: string;
    onStateChange: (publication: Pub) => {};
    params: IPublicationContentPropsParams;
}

export class RouteStateSync1 extends React.Component< IPublication & ISyncParams, {}> {

    public componentWillMount(): void {
        const { onStateChange, params } = this.props;

        if (this.needSync(params as Pub)) {
            onStateChange({
                publicationId: params.publicationId,
                pageId: (params.pageIdOrPublicationTitle || "")
            });
        }
    }

    public componentWillReceiveProps(nextProps: ISyncParams): void {
      const { pageId, publicationId } = nextProps;
      if (this.needSync(nextProps)) {
          browserHistory.push(Url.getPageUrl(pageId, publicationId));
      }
    }

    public render(): JSX.Element {
        return <div></div>;
    }

    private needSync(routeParams: Pub): boolean {
        const props = this.props;
        const { params } = props ;

        return params.publicationId !== props.publicationId
        || params.pageIdOrPublicationTitle !== props.pageId;
    }
}

const mapStateToProps = (state: IState) => ({
    publicationId: state.publication.id,
    pageId: state.publication.pageId
});

const mapDispatchToProps = {
    onStateChange: publicationRouteChanged
};

export const RouteStateSync = connect(mapStateToProps, mapDispatchToProps)(RouteStateSync1);