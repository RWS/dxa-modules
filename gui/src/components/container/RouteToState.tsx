import * as React from "react";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { publicationRouteChanged } from "store/actions/Actions";
import { IPublicationContentPropsParams } from "./PublicationContentX";
import { withRouter } from "react-router";

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

export type Props = IPublication & ISyncParams;
export class RouteToState1 extends React.Component<Props, {}> {

    public shouldComponentUpdate(nextProps: ISyncParams): boolean {
        return this.needUpdateState(this.props.params, nextProps.params);
    }

    public componentDidUpdate(): void {
        const { params, onStateChange } = this.props;
        const publicationId: string = params.publicationId;
        const pageId: string = (params.pageIdOrPublicationTitle || "");
        onStateChange({
            publicationId, pageId
        });
    }

    public render(): JSX.Element {
        return <div></div>;
    }

    private needUpdateState(curParams: IPublicationContentPropsParams, nextParams: IPublicationContentPropsParams): boolean {
        return !compareProps(curParams, nextParams);
    }

    // private needUpdateLocation(props: Props, nextProps: Props): boolean {
    //     return this.needUpdateLocationX({
    //         publicationId: props.publicationId,
    //         pageId: props.pageId
    //     }, {
    //         publicationId: nextProps.publicationId,
    //         pageId: nextProps.pageId
    //     });
    // }
    // private needUpdateLocationX(curPub: IPublication, nextPub: IPublication): boolean {
    //     return !compareProps(curPub, nextPub);
    // }
}

const mapStateToProps = (state: IState) => ({
    publicationId: state.publication.id,
    pageId: state.publication.pageId
});

const mapDispatchToProps = {
    onStateChange: publicationRouteChanged
};

export const RouteToState = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(RouteToState1)
);

function compareProps(props1: {}, props2: {}): boolean {
    return JSON.stringify(props1) === JSON.stringify(props2); //magic :)
}