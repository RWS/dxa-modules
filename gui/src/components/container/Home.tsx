import * as React from "react";
import { IAppContext } from "components/container/App";
import { TopBar } from "components/presentation/TopBar";
import { SearchBar } from "components/presentation/SearchBar";
import { IPublicationContentProps } from "components/container/PublicationContent";

import "components/container/styles/App";
import "components/container/styles/Home";

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
    isNavOpen?: Boolean;

    /**
     * if search panel is open
     *
     * @type {Boolean}
     */
    isSearchOpen?: Boolean;
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
            isNavOpen: false,
            isSearchOpen: false
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
        const { localizationService } = this.context.services;
        const { isNavOpen, isSearchOpen } = this.state;
        const { children } = this.props;

        const child = children as React.ReactElement<IPublicationContentProps>;

        // Only pages with publiction selected can have navigation menu button enabled
        const publicationTitle = child && child.props.params.publicationTitle;
        const hasPublication = !!publicationTitle;

        return (
            hasPublication
                ? <div className={"sdl-dita-delivery-app" + (isNavOpen ? " open" : "") + (isSearchOpen ? " search-open" : "")}>
                    <div className={"sdl-dita-delivery-nav-mask"} onClick={this._toggleNavigationMenu.bind(this)} />
                    <TopBar
                        language={localizationService.formatMessage("app.language")}>
                        <div className={"sdl-dita-delivery-topbar-expand-search"} onClick={this._toggleSearchPanel.bind(this)} >
                            <span />
                        </div>
                        <div className={"sdl-dita-delivery-topbar-expand-nav"} onClick={this._toggleNavigationMenu.bind(this)} >
                            <span />
                        </div>
                    </TopBar>
                    <SearchBar
                        placeholderLabel={localizationService.formatMessage("components.searchbar.placeholder", [publicationTitle || ""])}
                        onSearch={query => console.log(query)} />
                    {children}
                </div >
                : <div className={"sdl-dita-delivery-app"}>
                    <TopBar
                        language={localizationService.formatMessage("app.language")} />
                    {children}
                </div >
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

    private _toggleSearchPanel(): void {
        const { isSearchOpen } = this.state;
        this.setState({
            isSearchOpen: !isSearchOpen
        });
    }
};
