import * as React from "react";
import { IAppContext } from "components/container/App";
import { TopBar } from "components/presentation/TopBar";
import { SearchBar } from "components/presentation/SearchBar";
import { IPublicationContentProps } from "components/container/PublicationContent";

import "components/container/styles/App";
import "components/container/styles/Home";

const FIXED_NAV_CLASS = "fixed-nav";
const SEARCH_OPEN_CLASS = "search-open";
const NAV_PANEL_OPEN_CLASS = "open";

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

    /**
     * if page is scrolled
     *
     * @type {Boolean}
     */
    sticksToTop?: Boolean;
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
    private _isUnmounted: boolean = false;

    /**
     * Creates an instance of App.
     *
     */
    constructor() {
        super();
        this.state = {
            isNavOpen: false,
            sticksToTop: false,
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
     * Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
     */
    public componentDidMount(): void {

        window.addEventListener("scroll", this._onViewportChanged.bind(this));
        window.addEventListener("resize", this._onViewportChanged.bind(this));
        this._onViewportChanged();
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { localizationService } = this.context.services;
        const { isNavOpen, isSearchOpen, sticksToTop } = this.state;
        const { children } = this.props;

        const child = children as React.ReactElement<IPublicationContentProps>;

        // Only pages with publiction selected can have navigation menu button enabled
        const publicationTitle = child && child.props.params.publicationTitle;
        const hasPublication = !!publicationTitle;

        let rootClasses = ["sdl-dita-delivery-app"];
        if (sticksToTop) {
            rootClasses.push(FIXED_NAV_CLASS);
        }
        if (hasPublication && isNavOpen) {
            rootClasses.push(NAV_PANEL_OPEN_CLASS);
        }
        if (isSearchOpen) {
            rootClasses.push(SEARCH_OPEN_CLASS);
        }

        return (
            <div className={rootClasses.join(" ")}>
                <div className={"sdl-dita-delivery-nav-mask"} onClick={this._toggleNavigationMenu.bind(this)} />
                <TopBar
                    language={localizationService.formatMessage("app.language")}>
                    {
                        hasPublication && (
                            <div className={"sdl-dita-delivery-topbar-expand-nav"} onClick={this._toggleNavigationMenu.bind(this)} >
                                <span />
                            </div>)
                    }
                    <div className={"sdl-dita-delivery-topbar-expand-search"} onClick={this._toggleSearchPanel.bind(this)} >
                        <span />
                    </div>
                </TopBar>
                <SearchBar
                    placeholderLabel={
                        hasPublication
                            ? localizationService.formatMessage("components.searchbar.publication.placeholder", [publicationTitle || ""])
                            : localizationService.formatMessage("components.searchbar.placeholder", [""])
                    }
                    onSearch={query => console.log(query)} />
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
        this._isUnmounted = true;
        if (this._historyUnlisten) {
            this._historyUnlisten();
        }

        window.removeEventListener("scroll", this._onViewportChanged.bind(this));
        window.removeEventListener("resize", this._onViewportChanged.bind(this));
    }

    private _toggleNavigationMenu(): void {
        const { isNavOpen } = this.state;
        /* istanbul ignore if */
        if (!this._isUnmounted) {
            this.setState({
                isNavOpen: !isNavOpen
            });
        }
    }

    private _onNavigated(location: HistoryModule.Location): void {
        /* istanbul ignore if */
        if (!this._isUnmounted) {
            this.setState({
                isNavOpen: false
            });
        }
    }

    private _toggleSearchPanel(): void {
        const { isSearchOpen } = this.state;
        /* istanbul ignore if */
        if (!this._isUnmounted) {
            this.setState({
                isSearchOpen: !isSearchOpen
            });
        }
    }

    private _onViewportChanged(): void {
        const { sticksToTop } = this.state;
        /* istanbul ignore if */
        if (!this._isUnmounted) {
            if (sticksToTop !== (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0) > 0) {
                this.setState({
                    sticksToTop: !sticksToTop
                });
            }
        }
    }
};
