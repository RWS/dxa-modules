import * as ClassNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";
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
     * @type {boolean}
     */
    isNavOpen?: boolean;

    /**
     * if search panel is open
     *
     * @type {boolean}
     */
    searchIsOpen?: boolean;

    /**
     * if search panel is open
     *
     * @type {boolean}
     */
    searchIsOpening?: boolean;

    /**
     * if search panel is open
     *
     * @type {boolean}
     */
    searchIsActive?: boolean;

    /**
     * if page is scrolled
     *
     * @type {boolean}
     */
    sticksToTop?: boolean;

    /**
     * Title of the current search
     *
     * @type {string}
     */
    searchTitle?: string;

    /**
     * Selected publication Id
     *
     * @type {string}
     */
    publicationId?: string;
}

/**
 * Home props
 *
 * @export
 * @interface IHomeProps
 */
export interface IHomeProps {

    /**
     * Children
     *
     * @type {React.ReactNode}
     * @memberOf INavigationMenuProps
     */
    children?: React.ReactNode;
}

/**
 * Main component for the application
 */
export class Home extends React.Component<IHomeProps, IHomeState> {

    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired,
        router: React.PropTypes.object.isRequired
    };

    public context: IAppContext;

    private _historyUnlisten: () => void;
    private _isUnmounted: boolean = false;
    private _preventBodyScroll: boolean = false;

    /**
     * Creates an instance of App.
     *
     */
    constructor() {
        super();
        this.state = {
            isNavOpen: false,
            sticksToTop: false,
            searchIsOpen: false,
            searchIsActive: false
        };
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {
        const { router } = this.context;
        const child = this.props.children as React.ReactElement<IPublicationContentProps>;
        const publicationId = child.props.params.publicationId;

        if (router) {
            this._historyUnlisten = router.listen(this._onNavigated.bind(this));
        }

        this._updateSearchPlaceholder(publicationId);
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
     * Invoked immediately before rendering when new props or state are being received.
     * This method is not called for the initial render.
     *
     * @param {IHomeProps} nextProps Next props
     * @param {IHomeState} nextState Next state
     */
    public componentWillUpdate(nextProps: IHomeProps, nextState: IHomeState): void {
        const { publicationId } = this.state;

        const child = nextProps.children as React.ReactElement<IPublicationContentProps>;
        const nextPublicationId = child.props.params.publicationId;

        if (nextPublicationId !== publicationId) {
            this._updateSearchPlaceholder(nextPublicationId);
        }
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { localizationService } = this.context.services;
        const { isNavOpen, searchIsOpen, searchIsOpening, searchIsActive, sticksToTop, searchTitle, publicationId } = this.state;
        const { children } = this.props;

        const hasPublication = publicationId !== undefined;

        const appClass = ClassNames({
            "sdl-dita-delivery-app": true,
            "fixed-nav": sticksToTop,
            "open": hasPublication && isNavOpen,
            "search-open": searchIsOpen,
            "search-is-opening": searchIsOpening,
            "search-is-active": searchIsOpen && searchIsActive
        });

        this._preventBodyScroll = (hasPublication && isNavOpen) || (searchIsOpen && searchIsActive) || false;

        return (
            <div className={appClass}>
                <div className={"sdl-dita-delivery-nav-mask"} onClick={isNavOpen && this._toggleNavigationMenu.bind(this)} />
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
                    placeholderLabel={searchTitle || ""}
                    onSearch={query => console.log(query)}
                    onFocus={() => {
                        if (!this._isUnmounted) {
                            this.setState({
                                searchIsActive: true
                            });
                        }
                    } }
                    onBlur={() => {
                        if (!this._isUnmounted) {
                            this.setState({
                                searchIsActive: false
                            });
                        }
                    } } />
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

        // HACK: we should prevent scrolling when fade overlay is shown
        if (document.body) {
            if (this._preventBodyScroll) {
                document.body.style.overflow = "hidden";
            }
            else {
                document.body.style.removeProperty("overflow");
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

        if (this._preventBodyScroll) {
            this._preventBodyScroll = false;
            if (document.body) {
                document.body.style.removeProperty("overflow");
            }
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
        const { searchIsOpen } = this.state;
        /* istanbul ignore if */
        if (!this._isUnmounted) {
            // Add animation to the main content to allow a smoot transition
            // This was hard to achieve using css only as the animation would also be triggered when for example scrolling back to the top
            // Therefore this solution using js was chosen so the animation only occurs in case of expand / collapse of the search panel

            const domNode = ReactDOM.findDOMNode(this);
            const searchNode = domNode.querySelector(".sdl-dita-delivery-searchbar") as HTMLElement;
            if (searchNode) {
                const _onTransitionEnd = () => {
                    searchNode.removeEventListener("transitionend", _onTransitionEnd);
                    this.setState({
                        searchIsOpening: false
                    });
                };
                searchNode.addEventListener("transitionend", _onTransitionEnd);
            }

            this.setState({
                searchIsOpening: true,
                searchIsOpen: !searchIsOpen
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

    private _updateSearchPlaceholder(publicationId?: string): void {
        const { publicationService, localizationService } = this.context.services;
        if (publicationId) {
            // Get publication title
            publicationService.getPublicationTitle(publicationId).then(
                title => {
                    /* istanbul ignore else */
                    if (!this._isUnmounted) {
                        this.setState({
                            publicationId: publicationId,
                            searchTitle: localizationService.formatMessage("components.searchbar.publication.placeholder", [title || ""])
                        });
                    }
                },
                error => {
                    /* istanbul ignore else */
                    if (!this._isUnmounted) {
                        // TODO: improve error handling
                        this.setState({
                            publicationId: publicationId,
                            searchTitle: error
                        });
                    }
                });
        } else {
            this.setState({
                publicationId: publicationId,
                searchTitle: localizationService.formatMessage("components.searchbar.placeholder")
            });
        }
    }
};
