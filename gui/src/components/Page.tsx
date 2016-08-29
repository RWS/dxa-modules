/// <reference path="../interfaces/ServerModels.d.ts" />

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
         * Page content
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
    }

    /**
     * Page component
     */
    export const Page = (props: IPageProps): JSX.Element => {
        return (
            <div className={"sdl-dita-delivery-page"}>
                { props.showActivityIndicator ? <ActivityIndicator/> : null }
                { props.error ?
                    <ValidationMessage messageType={SDL.UI.Controls.ValidationMessageType.Error} message={props.error} /> :
                    <div className={"page-content"} dangerouslySetInnerHTML={{ __html: props.content }} />
                }
            </div>
        );
    };

}
