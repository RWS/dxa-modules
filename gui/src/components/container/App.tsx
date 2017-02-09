import * as React from "react";
import { Router, Route, IndexRedirect, History, Redirect } from "react-router";
import { IServices } from "interfaces/Services";
import { Home } from "components/container/Home";
import { PublicationContent } from "components/container/PublicationContent";
import { PublicationsList } from "components/container/PublicationsList";
import { ErrorContent } from "components/container/ErrorContent";
import { IWindow } from "interfaces/Window";

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
        const errorObj = (window as IWindow).SDLDitaDeliveryError;
        if (errorObj) {
            return <ErrorContent error={errorObj}/>;
        } else {
            return (
                <Router history={history}>
                    <Route path="/" component={Home} >
                        <IndexRedirect to="/home" />
                        <Redirect from="home;jsessionid=*" to="/home" />
                        <Redirect from="/" to="/home" />
                        <Route path="home" component={PublicationsList} />
                        <Route path=":publicationId(/:pageIdOrPublicationTitle)(/:publicationTitle)(/:pageTitle)(/:pageAnchor)" component={PublicationContent} />
                    </Route>
                </Router>
            );
        }
    }
};
