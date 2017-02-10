import * as React from "react";
import { IAppContext } from "components/container/App";
import { TopBar } from "components/presentation/TopBar";
import { IPublicationContentProps } from "components/container/PublicationContent";

import "components/container/styles/App";

/**
 * Home state
 *
 * @export
 * @interface IHomeState
 */
export interface IHomeState {
    /**
     * if Nav panel is open
     *
     * @type {Boolean}
     */
    isNavOpen: Boolean;
}

/**
 * Main component for the application
 */
export class Home extends React.Component<{}, IHomeState> {

    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired,
        router: React.PropTypes.object.isRequired
    };

    public context: IAppContext;

    private _historyUnlisten: () => void;

    /**
     * Creates an instance of App.
     *
     */
    constructor() {
        super();
        this.state = {
            isNavOpen: false
        };
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {
        const { router} = this.context;

        if (router) {
            this._historyUnlisten = router.listen(this._onNavigated.bind(this));
        }
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { formatMessage, getDirection } = this.context.services.localizationService;
        const { isNavOpen } = this.state;
        const { children } = this.props;

        const child = children as React.ReactElement<IPublicationContentProps>;

        // Only pages with publiction selected can have navigation menu button enabled
        const canHaveNavMenuButton = child && (child.props.params.publicationId !== undefined);
        return (
            <div dir={getDirection()} className={"sdl-dita-delivery-app" + (canHaveNavMenuButton
                ? " sdl-dita-delivery-app-nav" + (isNavOpen ? " open" : "")
                : "")}>
                <TopBar
                    language={formatMessage("app.language")}
                    toggleNavigationMenu={canHaveNavMenuButton && this._toggleNavigationMenu.bind(this)}
                    />
                {children}
            </div>
        );
    }

    /**
     * Invoked immediately after updating.
     */
    public componentDidUpdate(prevProp: {}, prevState: IHomeState): void {
        const { isNavOpen } = this.state;

        if (prevState.isNavOpen !== isNavOpen) {
            // HACK: we should use some global state store to achieve this
            const navMenu = document.querySelector(".sdl-dita-delivery-navigation-menu");
            if (navMenu) {
                if (isNavOpen) {
                    navMenu.classList.add("open");
                } else {
                    navMenu.classList.remove("open");
                }
            }
        }
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount(): void {
        if (this._historyUnlisten) {
            this._historyUnlisten();
        }
    }

    private _toggleNavigationMenu(): void {
        const { isNavOpen } = this.state;

        this.setState({
            isNavOpen: !isNavOpen
        });
    }

    private _onNavigated(location: HistoryModule.Location): void {
        this.setState({
            isNavOpen: false
        });
    }
};
