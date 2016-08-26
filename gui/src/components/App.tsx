/// <reference path="Toc.tsx" />

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
         * Table of contents
         */
        toc?: {
            /**
             * Root items, showed on initial render
             *
             * @type {ISitemapItem[]}
             */
            rootItems: ISitemapItem[];
            /**
             * Load child items for a specific item
             */
            loadChildItems: (parentId: string, callback: (error: string, children: ISitemapItem[]) => void) => void;
        };
        /**
         * Page information
         */
        page?: {
            /**
             * Page content
             *
             * @type {string}
             */
            content: string;
        };
        /**
         * Localization
         */
        localization: ILocalization;
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
     * Main component for the application
     */
    export const App = (props: IAppProps) => {
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
                        <Toc {...props.toc}/>
                        <div className={"page"}>
                        {props.page ?
                            <div className={"page-content"} dangerouslySetInnerHTML={{ __html: props.page.content }} />
                            : <ActivityIndicator/>
                        }
                        </div>
                    </section>
                </div>
            );
        } else {
            return (<ActivityIndicator text={formatMessage("components.app.loading") }/>);
        }
    };
}
