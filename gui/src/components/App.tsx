/// <reference path="Toc.tsx" />
/// <reference path="Page.tsx" />

module Sdl.DitaDelivery.Components {

    import ActivityIndicator = SDL.ReactComponents.ActivityIndicator;
    import TopBar = SDL.ReactComponents.TopBar;
    import ISitemapItem = Server.Models.ISitemapItem;
    import IPageInfo = Sdl.DitaDelivery.Models.IPageInfo;

    /**
     * App component props
     *
     * @export
     * @interface IAppProps
     */
    export interface IAppProps {
        /**
         * Localization
         */
        localization: ILocalization;
        /**
         * Table of contents
         */
        toc?: ITocProps;
        /**
         * Get page info for a specific page
         */
        getPageInfo?: (pageId: string, callback: (error: string, info?: IPageInfo) => void) => void;
    }

    /**
     * Localization
     */
    export interface ILocalization {
        /**
         * Give the message for a resource id
         */
        formatMessage: (path: string, variables?: string[]) => string;
    }

    /**
     * App component state
     *
     * @export
     * @interface IAppState
     */
    export interface IAppState {
        /**
         * Current selected sitemap item in the TOC
         *
         * @type {string}
         */
        selectedSiteMapItem?: ISitemapItem;
        /**
         * Page state
         */
        page?: {
            /**
             * Content of the current selected page
             *
             * @type {string}
             */
            content?: string;
            /**
             * An error prevented the page from rendering
             *
             * @type {string}
             */
            error?: string;
            /**
             * Page is loading
             *
             * @type {boolean}
             */
            isLoading?: boolean;
            /**
             * Page title
             *
             * @type {string}
             */
            title?: string;
        };
    }

    /**
     * Main component for the application
     */
    export class App extends React.Component<IAppProps, IAppState> {

        /**
         * Creates an instance of App.
         *
         */
        constructor() {
            super();
            this.state = {
                selectedSiteMapItem: null,
                page: {
                    content: null,
                    title: null,
                    error: null,
                    isLoading: false
                }
            };
        }

        /**
         * Invoked when a component is receiving new props. This method is not called for the initial render.
         *
         * @param {IAppProps} nextProps Next props
         */
        public componentWillReceiveProps(nextProps: IAppProps): void {
            this.setState({
                page: {
                    error: null
                }
            });
        }

        /**
         * Invoked immediately before rendering when new props or state are being received.
         * This method is not called for the initial render.
         *
         * @param {IAppProps} nextProps Next props
         * @param {IAppState} nextState Next state
         */
        public componentWillUpdate(nextProps: IAppProps, nextState: IAppState): void {
            const state = this.state;
            const currentUrl = state.selectedSiteMapItem ? state.selectedSiteMapItem.Url : null;
            const nextUrl = nextState.selectedSiteMapItem ? nextState.selectedSiteMapItem.Url : null;
            if (nextUrl && (state.page.isLoading || currentUrl !== nextUrl)) {
                nextProps.getPageInfo(nextUrl, this._onPageContentRetrieved.bind(this));
            }
        }

        /**
         * Render the component
         *
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            const props = this.props;
            const state = this.state;
            const formatMessage = props.localization.formatMessage;
            if (props.toc) {
                return (
                    <div className={"sdl-dita-delivery-app"}>
                        <TopBar title={formatMessage("components.app.title") } buttons={{
                            user: {
                                isPicture: true
                            }
                        }}/>
                        <section className={"content"}>
                            <Toc {...props.toc} onSelectionChanged={this._onTocSelectionChanged.bind(this) }/>
                            <Page showActivityIndicator={state.page.isLoading}
                                content={state.page.content}
                                title={state.page.title}
                                error={state.page.error}/>
                        </section>
                    </div>
                );
            } else {
                return (<ActivityIndicator text={formatMessage("components.app.loading") }/>);
            }
        }

        private _onTocSelectionChanged(sitemapItem: ISitemapItem): void {
            this.setState({
                selectedSiteMapItem: sitemapItem,
                page: {
                    isLoading: sitemapItem.Url ? true : false,
                    title: !sitemapItem.Url ? sitemapItem.Title : undefined
                }
            });
        }

        private _onPageContentRetrieved(error: string, pageInfo: IPageInfo): void {
            if (error) {
                this.setState({
                    page: {
                        error: error,
                        isLoading: false
                    }
                });
                return;
            }
            this.setState({
                page: {
                    content: pageInfo.content,
                    title: pageInfo.title ? pageInfo.title : this.state.selectedSiteMapItem.Title,
                    isLoading: false
                }
            });
        }
    };
}
