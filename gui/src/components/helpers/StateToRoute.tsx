import * as React from "react";
import { connect } from "react-redux";
import { withRouter, browserHistory } from "react-router";
import { Url } from "utils/Url";
import { getCurrentPub, getPageById, getPubById } from "store/reducers/Reducer";
import { IPublicationContentPropsParams } from "interfaces/PublicationContentPropsParams";
import { IPublicationCurrentState, IState } from "store/interfaces/State";
import { isDummyPage } from "utils/Page";

// Placeholder for titles in url, when title for url is not  avaible but required, for intance if there is anchor
// but there is no pageTitle. There is pageTitle but there's no publication title.
const TITLE_PLACEHOLDER: string = "_";

export interface ISyncParams {
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
     * Checks is we need to update location if route changed.
     */
    public shouldComponentUpdate(nextProps: Props): boolean {

        return this.propsToUrl(nextProps) !== this.propsToUrl(this.props)
            && this.propsToUrl(nextProps) !== browserHistory.getCurrentLocation().pathname;
    }

    /**
     * Invoked immediately after updating.
     * Updates locating, decides if it need to add to histore or replace last item in a history.
     */
    public componentDidUpdate(prevProps: Props): void {
        const props = this.props;

        if (prevProps.publicationId !== props.publicationId
            || prevProps.anchor !== props.anchor
            || prevProps.pageId !== "" && prevProps.pageId !== props.pageId) {
            browserHistory.push(this.propsToUrl(props));
        } else {
            //No need to push to history if only titles have chagned.
            browserHistory.replace(this.propsToUrl(props));
        }
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
        const { publicationId, pageId, publicationTitle: propsPublicationTitle, pageTitle: propsPageTitle, anchor } = props;
        const pageTitle = anchor && !propsPageTitle ? TITLE_PLACEHOLDER : propsPageTitle;
        const publicationTitle = (anchor || pageTitle) && !propsPublicationTitle ? TITLE_PLACEHOLDER : propsPublicationTitle;

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
    const page = getPageById(state, publicationId, pageId);

    return {
        publicationId,
        pageId,
        publicationTitle,
        anchor,
        pageTitle: !isDummyPage(page) ? page.title : ""
    };
};

/**
 * Connector of state to route component for Redux
 *
 * @export
 */
export const StateToRoute = withRouter(
    connect(mapStateToProps)(StateToRoutePresentation)
);