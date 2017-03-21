import * as React from "react";
import { connect } from "react-redux";
import { withRouter, browserHistory } from "react-router";
import { Url } from "utils/Url";
import { getCurrentPub, getErrorMessage, getPageById, getPubById } from "store/reducers/Reducer";
import { publicationRouteChanged } from "store/actions/Actions";
import { IPublicationContentPropsParams } from "interfaces/PublicationContentPropsParams";
import { IPublicationCurrentState, IState } from "store/interfaces/State";
import { isDummyPage } from "utils/Page";

export interface ISyncParams {
    /**
     * Function with the following format to execute when state changes
     *     `@param   {IPublicationCurrentState}
     *     `@returns {void}
     *
     * @memberOf ISyncParams
     */
    onStateChange: (publication: IPublicationCurrentState) => {};
    /**
     * Parameters
     *
     * @type {IPublicationContentPropsParams}
     * @memberOf ISyncParams
     */
    params: IPublicationContentPropsParams;
    /**
     * Current publication title
     *
     * @type {string}
     * @memberOf ISyncParams
     */
    publicationTitle: string;
    /**
     * Current page title
     *
     * @type {string}
     * @memberOf ISyncParams
     */
    pageTitle: string;
    /**
     * Current anchor pointer
     *
     * @type {string}
     * @memberOf ISyncParams
     */
    anchor: string;
    /**
     * Is it a dummy page?
     *
     * @type {boolean}
     * @memberOf ISyncParams
     */
    dummy: boolean;
}

/**
 * State to route props
 */
export type Props = IPublicationCurrentState & ISyncParams;

/**
 * State to route component
 */
export class StateToRoutePresentation extends React.Component<Props, {}> {
    /**
     * Invoked immediately after the component's updates are flushed to the DOM. This method is not called for the initial render.
     */
    public shouldComponentUpdate(nextProps: Props): boolean {
        return !nextProps.dummy && this.propsToUrl(nextProps) !== this.propsToUrl(this.props);
    }

    /**
     * Invoked immediately after updating.
     */
    public componentDidUpdate(): void {
        // need to use replace if only title was updated, to avoid 2 times back.
        browserHistory.push(this.propsToUrl(this.props));
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return (<div />);
    }

    private propsToUrl(props: Props): string {
        const { publicationId, pageId, publicationTitle, pageTitle, anchor } = props;

        if (pageId) {
            const pageUrl = Url.getPageUrl(publicationId, pageId, publicationTitle, pageTitle);
            return anchor ? Url.getAnchorUrl(pageUrl, anchor) : pageUrl;
        } else {
            return Url.getPublicationUrl(publicationId, publicationTitle);
        }
    }
}

const mapStateToProps = (state: IState) => {
    const { publicationId, pageId, anchor } = getCurrentPub(state);
    const { title: publicationTitle } = getPubById(state, publicationId);
    const page = getPageById(state, pageId);

    return {
        publicationId,
        pageId,
        publicationTitle,
        anchor,
        pageTitle:  !isDummyPage(page) ? page.title : "",
        dummy: !getErrorMessage(state, pageId) && isDummyPage(page)
    };
};

const mapDispatchToProps = {
    onStateChange: publicationRouteChanged
};

/**
 * Connector of state to route component for Redux
 *
 * @export
 */
export const StateToRoute = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(StateToRoutePresentation)
);