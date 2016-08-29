/// <reference path="Toc.tsx" />
/// <reference path="Page.tsx" />

module Sdl.DitaDelivery.Components {

    import ActivityIndicator = SDL.ReactComponents.ActivityIndicator;
    import TopBar = SDL.ReactComponents.TopBar;
    import ISitemapItem = Server.Models.ISitemapItem;

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
         * Page information
         */
        page?: IPageProps;
        /**
         * Get content for a specific page
         */
        getPageContent?: (pageId: string, callback: (error: string, content: string) => void) => void;
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
         * Content of the current selected page
         *
         * @type {string}
         */
        pageContent?: string;
        /**
         * An error prevented the page from rendering
         *
         * @type {string}
         */
        pageError?: string;
        /**
         * Page is loading
         *
         * @type {boolean}
         */
        pageIsLoading?: boolean;
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
                pageContent: null,
                pageError: null,
                pageIsLoading: false
            };
        }

        /**
         * Invoked when a component is receiving new props. This method is not called for the initial render.
         *
         * @param {IAppProps} nextProps Next props
         */
        public componentWillReceiveProps(nextProps: IAppProps): void {
            this.setState({
                pageError: null
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
            if (nextUrl && (state.pageIsLoading || currentUrl !== nextUrl)) {
                nextProps.getPageContent(nextUrl, this._onPageContentRetrieved.bind(this));
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
                            <Page showActivityIndicator={state.pageIsLoading} content={state.pageContent} error={state.pageError}/>
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
                pageIsLoading: sitemapItem.Url ? true : false,
                pageContent: !sitemapItem.Url ? sitemapItem.Title : undefined
            });
        }

        private _onPageContentRetrieved(error: string, content: string): void {
            if (error) {
                this.setState({
                    pageError: error,
                    pageIsLoading: false
                });
                return;
            }
            this.setState({
                pageContent: content ? content : this.state.selectedSiteMapItem.Title,
                pageIsLoading: false
            });
        }
    };
}
