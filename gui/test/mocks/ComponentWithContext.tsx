import { IServices } from "../../src/interfaces/Services";

export interface IComponentWithContextContext {
    services: IServices;
    router: IRouter;
}

export interface IComponentWithContextProps {
    services: IServices;
}

interface IRouter {
    createHref: () => void;
    push: () => void;
    replace: () => void;
    go: () => void;
    goBack: () => void;
    goForward: () => void;
    setRouteLeaveHook: () => void;
    isActive: () => void;
}

export class ComponentWithContext extends React.Component<IComponentWithContextProps, {}> {

    public static childContextTypes: React.ValidationMap<IComponentWithContextContext> = {
        services: React.PropTypes.object,
        router: React.PropTypes.object
    };

    public getChildContext(): IComponentWithContextContext {
        return {
            services: this.props.services,
            router: {
                createHref: (): void => { },
                push: (): void => { },
                replace: (): void => { },
                go: (): void => { },
                goBack: (): void => { },
                goForward: (): void => { },
                setRouteLeaveHook: (): void => { },
                isActive: (): void => {}
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
