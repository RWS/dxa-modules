import { IAppContext } from "components/container/App";
import { TopBar } from "components/presentation/TopBar";

import "components/container/styles/App";

/**
 * TopBar props
 *
 * @export
 * @interface ITopBarProps
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
        services: React.PropTypes.object.isRequired
    };

    public context: IAppContext;

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
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { localizationService } = this.context.services;
        const { isNavOpen } = this.state;
        return (
            <div className={"sdl-dita-delivery-app" + (isNavOpen ? " sdl-dita-delivery-app-nav-open" : "")}>
                <TopBar
                    title={localizationService.formatMessage("app.productfamily")}
                    language={localizationService.formatMessage("app.language")}
                    toggleNavigationMenu={this._toggleNavigationMenu.bind(this)}
                    />
                {this.props.children}
            </div>
        );
    }

    private _toggleNavigationMenu(): void {
        const { isNavOpen } = this.state;
        this.setState({
            isNavOpen: !isNavOpen
        });

        // HACK: we should use some global state store to achieve this
        const navMenu = document.querySelector(".sdl-dita-delivery-navigation-menu");
        if (navMenu) {
            if (!isNavOpen) {
                navMenu.classList.add("open");
            } else {
                navMenu.classList.remove("open");
            }
        }
    }
};
