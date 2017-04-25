import * as React from "react";
import { Router, Route, IndexRedirect, History, Redirect } from "react-router";
import { IServices } from "interfaces/Services";
import { Home } from "@sdl/dd/Home/Home";
import { PublicationContent } from "@sdl/dd/PublicationContent/PublicationContent";
import { ProductFamiliesList } from "@sdl/dd/container/ProductFamiliesList/ProductFamiliesList";
import { ErrorContent } from "@sdl/dd/container/ErrorContent/ErrorContent";
import { PublicationsList } from "@sdl/dd/PublicationsList/PublicationsList";

import { path } from "utils/Path";
import { IWindow } from "interfaces/Window";
import { RouteToState } from "components/helpers/RouteToState";
import { StateToRoute } from "components/helpers/StateToRoute";
import { FetchPage } from "components/helpers/FetchPage";
import { FetchProductReleaseVersions } from "components/helpers/FetchProductReleaseVersions";

import "./App.less";

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
                        <Route path="publications/:productFamily(/:productReleaseVersion)" component={PublicationsList} />
                        <Route path=":publicationId(/:pageIdOrPublicationTitle)(/:publicationTitle)(/:pageTitle)(/:pageAnchor)"
                            component={() => (
                                <div className="sdl-dita-delivery-publication-content-wrapper">
                                    <RouteToState />
                                    <StateToRoute />
                                    <FetchPage />
                                    <FetchProductReleaseVersions />
                                    <PublicationContent />
                                </div>)} />
                    </Route>
                </Router>
            );
        }
    }
};
