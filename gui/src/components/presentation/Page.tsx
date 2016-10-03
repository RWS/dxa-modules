/// <reference path="../../interfaces/ServerModels.d.ts" />

module Sdl.DitaDelivery.Components {

    import ActivityIndicator = SDL.ReactComponents.ActivityIndicator;
    import ValidationMessage = SDL.ReactComponents.ValidationMessage;

    /**
     * Page component props
     *
     * @export
     * @interface IPageProps
     */
    export interface IPageProps {
        /**
         * Show activity indicator
         *
         * @type {boolean}
         */
        showActivityIndicator: boolean;
        /**
         * Page title
         *
         * @type {string | null}
         */
        title?: string | null;
        /**
         * Page content
         *
         * @type {string | null}
         */
        content?: string | null;
        /**
         * An error prevented the page from rendering
         *
         * @type {string | null}
         */
        error?: string | null;
    }

    /**
     * Page component
     */
    export const Page = (props: IPageProps): JSX.Element => {
        return (
            <div className={"sdl-dita-delivery-page"}>
                { props.showActivityIndicator ? <ActivityIndicator/> : null }
                { props.error ? <ValidationMessage messageType={SDL.UI.Controls.ValidationMessageType.Error} message={props.error} /> : null }
                <div>
                    <h1 className={"page-title"}>{props.title}</h1>
                    <div className={"page-content ltr"} dangerouslySetInnerHTML={{ __html: props.content || "" }} />
                </div>
            </div>
        );
    };

}
