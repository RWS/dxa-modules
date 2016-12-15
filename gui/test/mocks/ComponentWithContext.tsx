import { IServices } from "interfaces/Services";

export interface IComponentWithContextContext {
    services: IServices;
    router: IRouter;
}

export interface IComponentWithContextProps {
    services: IServices;
}

interface IRouter {
    createHref: () => void;
    push: (path: string) => void;
    replace: (path: string) => void;
    go: () => void;
    goBack: () => void;
    goForward: () => void;
    setRouteLeaveHook: () => void;
    isActive: () => void;
    getCurrentLocation: () => { pathname: string };
}

export class ComponentWithContext extends React.Component<IComponentWithContextProps, {}> {

    public static childContextTypes: React.ValidationMap<IComponentWithContextContext> = {
        services: React.PropTypes.object,
        router: React.PropTypes.object
    };

    public getChildContext(): IComponentWithContextContext {
        let pathname = "";
        return {
            services: this.props.services,
            router: {
                createHref: (): void => { },
                push: (path: string): void => { pathname = path; },
                replace: (path: string): void => { pathname = path; },
                go: (): void => { },
                goBack: (): void => { },
                goForward: (): void => { },
                setRouteLeaveHook: (): void => { },
                isActive: (): void => { },
                getCurrentLocation: (): { pathname: string } => {
                    return {
                        pathname: pathname
                    };
                }
            }
        };
    };

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return (
            <span>{this.props.children}</span>
        );
    }
};
