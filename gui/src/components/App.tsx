/// <reference path="Toc.tsx" />
/// <reference path="Page.tsx" />
/// <reference path="../interfaces/ServerModels.d.ts" />

module Sdl.DitaDelivery.Components {

    import TopBar = SDL.ReactComponents.TopBar;
    import ISitemapItem = Server.Models.ISitemapItem;
    import IPageInfo = Models.IPageInfo;

    /**
     * App component props
     *
     * @export
     * @interface IAppProps
     */
    export interface IAppProps {
    }

    /**
     * App component state
     *
     * @export
     * @interface IAppState
     */
    export interface IAppState {
        /**
         * Toc is loading
         *
         * @type {boolean}
         */
        isTocLoading?: boolean;
        /**
         * Current selected item in the TOC
         *
         * @type {string}
         */
        selectedTocItem?: ISitemapItem;
        /**
         * Page is loading
         *
         * @type {boolean}
         */
        isPageLoading?: boolean;
    }

    interface IPage {
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
         * Page title
         *
         * @type {string}
         */
        title?: string;
    }

    interface IToc {
        /**
         * Root items
         *
         * @type {ISitemapItem[]}
         */
        rootItems?: ISitemapItem[];
    }

    /**
     * Main component for the application
     */
    export class App extends React.Component<IAppProps, IAppState> {

        private _page: IPage = {};
        private _toc: IToc = {};
        private _isUnmounted: boolean = false;

        /**
         * Creates an instance of App.
         *
         */
        constructor() {
            super();
            this.state = {
                isTocLoading: true,
                selectedTocItem: null,
                isPageLoading: true
            };
        }

        /**
         * Invoked once, both on the client and server, immediately before the initial rendering occurs.
         */
        public componentWillMount(): void {
            // Get the data for the Toc
            DataStore.getSitemapRoot((error, children) => {
                if (!this._isUnmounted) {
                    const toc = this._toc;
                    toc.rootItems = children;
                    this.setState({
                        isTocLoading: false,
                        isPageLoading: Array.isArray(children) && children.length > 0
                    });
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
            const { selectedTocItem, isPageLoading } = this.state;
            const currentUrl = selectedTocItem ? selectedTocItem.Url : null;
            const nextUrl = nextState.selectedTocItem ? nextState.selectedTocItem.Url : null;
            if (nextUrl && (isPageLoading || currentUrl !== nextUrl)) {
                DataStore.getPageInfo(nextUrl, this._onPageContentRetrieved.bind(this));
            }
        }

        /**
         * Render the component
         *
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            const { isPageLoading, selectedTocItem } = this.state;
            const { content, title, error} = this._page;
            const { rootItems } = this._toc;
            const formatMessage = Localization.formatMessage;
            return (
                <div className={"sdl-dita-delivery-app"}>
                    <TopBar title={formatMessage("components.app.title") } buttons={{
                        user: {
                            isPicture: true
                        }
                    }}/>
                    <section className={"content"}>
                        <Toc
                            rootItems={rootItems}
                            loadChildItems={DataStore.getSitemapItems.bind(DataStore) }
                            onSelectionChanged={this._onTocSelectionChanged.bind(this) }/>
                        <Page
                            showActivityIndicator={isPageLoading}
                            content={content}
                            title={title ? title : (selectedTocItem ? selectedTocItem.Title : null) }
                            error={error}/>
                    </section>
                </div>
            );
        }

        /**
         * Component will unmount
         */
        public componentWillUnmount(): void {
            this._isUnmounted = true;
        }

        private _onTocSelectionChanged(sitemapItem: ISitemapItem): void {
            const page = this._page;
            page.error = null;
            if (!sitemapItem.Url) {
                page.title = undefined;
                page.content = undefined;
            }
            this.setState({
                selectedTocItem: sitemapItem,
                isPageLoading: sitemapItem.Url ? true : false
            });
        }

        private _onPageContentRetrieved(error: string, pageInfo: IPageInfo): void {
            const page = this._page;
            const { selectedTocItem } = this.state;
            if (error) {
                page.error = error;
                this.setState({
                    isPageLoading: false
                });
                return;
            }
            page.content = pageInfo.content;
            page.title = pageInfo.title ? pageInfo.title : selectedTocItem.Title;
            this.setState({
                isPageLoading: false
            });
        }
    };
}
