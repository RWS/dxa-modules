/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import * as ClassNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as PropTypes from "prop-types";
import { browserHistory } from "react-router";
import { IAppContext } from "@sdl/dd/container/App/App";
import { TopBar } from "@sdl/dd/presentation/TopBar";
import { SearchBar } from "@sdl/dd/presentation/SearchBar";
import { Url } from "utils/Url";

import "./Home.less";
import { FetchPublications } from "components/helpers/FetchPublications";

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
     * Title of the current search
     *
     * @type {string}
     */
    searchTitle?: string;
}

/**
 * Home props params
 *
 * @export
 * @interface IHomePropsParams
 */
export interface IHomePropsParams {
    /**
     * Selected publication Id
     *
     * @type {string}
     */
    publicationId: string;
}

/**
 * Home props
 *
 * @export
 * @interface IHomeProps
 */
export interface IHomeProps {
    /**
     * Home props params
     *
     * @type {string}
     */
    params: IHomePropsParams;

    /**
     * Children
     *
     * @type {React.ReactNode}
     * @memberOf INavigationMenuProps
     */
    children?: React.ReactNode;

    /**
     * UI language
     *
     * @type {string}
     * @memberOf IHomeProps
     */
    direction?: string;

    /**
     * true if conidtiosn dialog is shown
     * @type {boolean}
     */
    isConditionsDialogVisible?: boolean;
}

/**
 * Main component for the application
 */
export class HomePresentation extends React.Component<IHomeProps, IHomeState> {

    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: PropTypes.object.isRequired
    };

    public context: IAppContext;

    private _historyUnlisten: () => void;
    private _isUnmounted: boolean = false;
    private _preventBodyScroll: boolean = false;

    /* Always show a vertical scroll bar in IE / Edge due to an issue with animations not support calc based properties.
     Transitionable properties with calc() derived values are not supported below and including IE11.
     (http://connect.microsoft.com/IE/feedback/details/762719/css3-calc-bug-inside-transition-or-transform) */
    private _alwaysShowScrollBar: boolean = (document as Document & { documentMode: boolean }).documentMode || /Edge/.test(navigator.userAgent);

    /**
     * Creates an instance of App.
     */
    constructor() {
        super();
        this.state = {
            isNavOpen: false,
            searchIsOpen: false,
            searchIsActive: false
        };
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {
        const { publicationId } = this.props.params;
        if (browserHistory) {
            this._historyUnlisten = browserHistory.listen(this._onNavigated.bind(this));
        }

        this._updateSearchPlaceholder(publicationId);
    }

    /**
     * Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
     */
    public componentDidMount(): void {
        if (this._alwaysShowScrollBar) {
            (document.body as HTMLElement).style.overflowY = "scroll";
        }
    }

    /**
     * Invoked immediately before rendering when new props or state are being received.
     * This method is not called for the initial render.
     *
     * @param {IHomeProps} nextProps Next props
     * @param {IHomeState} nextState Next state
     */
    public componentWillUpdate(nextProps: IHomeProps, nextState: IHomeState): void {
        const { publicationId } = this.props.params;
        const { publicationId: nextPublicationId } = nextProps.params;

        if (nextPublicationId !== publicationId) {
            this._updateSearchPlaceholder(nextPublicationId);
        }
    }

    public componentWillReceiveProps(nextProps: IHomeProps): void {
        this._updateSearchPlaceholder(nextProps.params.publicationId);
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { isNavOpen, searchIsOpen, searchIsOpening, searchIsActive, searchTitle } = this.state;
        const { direction, isConditionsDialogVisible, children, params } = this.props;

        const publicationId = params.publicationId;
        const hasPublication = publicationId !== undefined;

        const appClass = ClassNames(direction || "ltr", "sdl-dita-delivery-app", {
            "open": hasPublication && isNavOpen,
            "search-open": searchIsOpen,
            "search-is-opening": searchIsOpening,
            "search-is-active": searchIsOpen && searchIsActive,
            "conditions-dialog-visible": isConditionsDialogVisible
        });

        this._preventBodyScroll = (hasPublication && isNavOpen) || (searchIsOpen && searchIsActive) || false;

        const onFocus = () => {
            if (!this._isUnmounted) {
                this.setState({
                    searchIsActive: true
                });
            }
        };

        const onBlur = () => {
            if (!this._isUnmounted) {
                this.setState({
                    searchIsActive: false
                });
            }
        };

        return (
            <div className={appClass}>
                <FetchPublications />
                <div className={"sdl-dita-delivery-nav-mask"} onClick={isNavOpen && this._toggleNavigationMenu.bind(this)} />
                <TopBar>
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
                    onSearch={
                        query => {
                            if (browserHistory) {
                                browserHistory.push(Url.getSearchUrl(query, publicationId));
                            }
                            onBlur();
                        }
                    }
                    onFocus={onFocus}
                    onBlur={onBlur} />
                {children}
            </div >
        );
    }

    /**
     * Invoked immediately after updating.
     */
    public componentDidUpdate(prevProp: {}, prevState: IHomeState): void {
        const { isNavOpen, searchIsOpen } = this.state;

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

        if (prevState.searchIsOpen === false && (prevState.searchIsOpen !== searchIsOpen)) {
            const domNode = ReactDOM.findDOMNode(this);
            const searchInput = domNode && domNode.querySelector(".sdl-dita-delivery-searchbar input") as HTMLInputElement;
            if (searchInput) {
                searchInput.focus();
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

        if (this._alwaysShowScrollBar) {
            (document.body as HTMLElement).style.removeProperty("overflow-y");
        }
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

    private _onNavigated(location: Location): void {
        /* istanbul ignore if */
        if (!this._isUnmounted) {
            this.setState({
                isNavOpen: false,
                searchIsOpening: false,
                searchIsActive: false,
                searchIsOpen: false
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
            const isAnimated = searchNode && getComputedStyle(searchNode).transitionProperty !== "none";
            if (isAnimated) {
                const _onTransitionEnd = () => {
                    searchNode.removeEventListener("transitionend", _onTransitionEnd);
                    /* istanbul ignore else */
                    if (!this._isUnmounted) {
                        this.setState({
                            searchIsOpening: false
                        });
                    }
                };
                searchNode.addEventListener("transitionend", _onTransitionEnd);
            }

            this.setState({
                searchIsOpening: isAnimated,
                searchIsOpen: !searchIsOpen
            });
        }
    }

    private _updateSearchPlaceholder(publicationId?: string): void {
        const { publicationService, localizationService } = this.context.services;
        if (publicationId) {
            // Get publication title
            publicationService.getPublicationById(publicationId).then(
                pub => {
                    /* istanbul ignore else */
                    if (!this._isUnmounted) {
                        this.setState({
                            searchTitle: localizationService.formatMessage("components.searchbar.publication.placeholder", [pub.title || ""])
                        });
                    }
                },
                error => {
                    /* istanbul ignore else */
                    if (!this._isUnmounted) {
                        // TODO: improve error handling
                        this.setState({
                            searchTitle: error
                        });
                    }
                });
        } else {
            /* istanbul ignore else */
            if (!this._isUnmounted) {
                this.setState({
                    searchTitle: localizationService.formatMessage("components.searchbar.placeholder")
                });
            }
        }
    }
};
