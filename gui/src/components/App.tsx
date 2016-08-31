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
        toc?: {
            /**
             * Toc is loading
             *
             * @type {boolean}
             */
            isLoading?: boolean;
            /**
             * Current selected item in the TOC
             *
             * @type {string}
             */
            selectedItem?: ISitemapItem;
            /**
             * Root items
             *
             * @type {ISitemapItem[]}
             */
            rootItems?: ISitemapItem[];
        };
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
                toc: {
                    isLoading: true,
                    selectedItem: null,
                    rootItems: null
                },
                page: {
                    content: null,
                    title: null,
                    error: null,
                    isLoading: false
                }
            };

            DataStore.getSitemapRoot((error, children) => {
                this.setState({
                    toc: {
                        isLoading: false,
                        rootItems: children
                    }
                });
            });
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
            const { toc, page } = this.state;
            const currentUrl = toc.selectedItem ? toc.selectedItem.Url : null;
            const nextUrl = nextState.toc ? nextState.toc.selectedItem.Url : null;
            if (nextUrl && (page.isLoading || currentUrl !== nextUrl)) {
                DataStore.getPageInfo(nextUrl, this._onPageContentRetrieved.bind(this));
            }
        }

        /**
         * Render the component
         *
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            const { page, toc } = this.state;
            const { content, title, error, isLoading } = page;
            const formatMessage = Localization.formatMessage;
            return (
                <div className={"sdl-dita-delivery-app"}>
                    <TopBar title={formatMessage("components.app.title") } buttons={{
                        user: {
                            isPicture: true
                        }
                    }}/>
                    <section className={"content"}>
                        <Toc {...toc}
                            loadChildItems={DataStore.getSitemapItems}
                            onSelectionChanged={this._onTocSelectionChanged.bind(this) }/>
                        <Page
                            showActivityIndicator={isLoading}
                            content={content}
                            title={title}
                            error={error}/>
                    </section>
                </div>
            );
        }

        private _onTocSelectionChanged(sitemapItem: ISitemapItem): void {
            this.setState({
                toc: {
                    selectedItem: sitemapItem
                },
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
                    title: pageInfo.title ? pageInfo.title : this.state.toc.selectedItem.Title,
                    isLoading: false
                }
            });
        }
    };
}
