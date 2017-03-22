import * as React from "react";
import { Router, Route, IndexRedirect, History, Redirect } from "react-router";
import { IServices } from "interfaces/Services";
import { Home } from "components/Home/Home";
import { PublicationContent } from "components/PublicationContent/PublicationContent";
import { ProductFamiliesList } from "components/container/ProductFamiliesList";
import { ErrorContent } from "components/container/ErrorContent";

import { path } from "utils/Path";
import { IWindow } from "interfaces/Window";
import { RouteToState } from "components/helpers/RouteToState";
import { StateToRoute } from "../helpers/StateToRoute";
import { FetchPublications } from "../helpers/FetchPublications";
import { FetchPage } from "components/helpers/FetchPage";
import { PublicationsList } from "../PublicationsList/PublicationsList";

export interface IAppProps {
    /**
     * Services
     *
     * @type {IServices}
     * @memberOf IAppProps
     */
    services: IServices;
    /**
     * History
     *
     * @type {History}
     * @memberOf IAppProps
     */
    history: History;
}

export interface IAppContext {
    /**
     * Router
     *
     * @type {ReactRouter.RouterOnContext}
     * @memberOf IAppContext
     */
    router?: ReactRouter.RouterOnContext;
    /**
     * Services
     *
     * @type {IServices}
     * @memberOf IAppContext
     */
    services: IServices;
}

/**
 * Main component for the application
 */
export class App extends React.Component<IAppProps, {}> {

    public static childContextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object
    };

    public getChildContext(): IAppContext {
        const { services} = this.props;
        return {
            services: services
        };
    };

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { history } = this.props;
        const errorObj = (window as IWindow).SdlDitaDeliveryError;
        if (errorObj) {
            return <ErrorContent error={errorObj} />;
        } else {
            return (
                <Router history={history}>
                    <Route path={path.getRootPath()} component={Home} >
                        <IndexRedirect to="home" />
                        <Redirect from="home;jsessionid=*" to="home" />
                        <Route path="home" component={ProductFamiliesList} />
                        <Route path="publications/:productFamily" component={PublicationsList} />
                        <Route path=":publicationId(/:pageIdOrPublicationTitle)(/:publicationTitle)(/:pageTitle)(/:pageAnchor)"
                            component={() => (
                                <div>
                                    <RouteToState />
                                    <StateToRoute />
                                    <FetchPublications />
                                    <FetchPage />
                                    <PublicationContent />
                                </div>)} />
                    </Route>
                </Router>
            );
        }
    }
};
