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
export class RouteStateSync1 extends React.Component<Props, {}> {
    private code: number | null = null;

    public shouldComponentUpdate(nextProps: ISyncParams): boolean {
        return this.needUpdateState(this.props.params, nextProps.params);
    }
    public componentDidUpdate(): void {
        const { params, onStateChange } = this.props;
        if (this.code !== null) {
            clearTimeout(this.code);
            this.code = null;
        }
        const publicationId: string = params.publicationId;
        const pageId: string = (params.pageIdOrPublicationTitle || "");
        console.log(pageId);
        // this.code = setTimeout((): void => {
        this.code = null;
        onStateChange({
            publicationId, pageId
        });
        // }, 0);
    }

    public render(): JSX.Element {
        return <div></div>;
    }

    // private needSync(): boolean {
    //     return true;
    // }
    private needUpdateState(curParams: IPublicationContentPropsParams, nextParams: IPublicationContentPropsParams): boolean {
        return !compareProps(curParams, nextParams);
    }

    // private needUpdateLocation(curPub: IPublication, nextPub: IPublication): boolean {
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

export const RouteStateSync = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(RouteStateSync1)
);

function compareProps(props1: {}, props2: {}): boolean {
    return JSON.stringify(props1) === JSON.stringify(props2);
}