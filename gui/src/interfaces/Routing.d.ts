declare module Sdl.DitaDelivery {

    /**
     * Routing instance
     */
    // tslint:disable-next-line:no-unused-variable
    var Routing: IRouting;

    /**
     * Routing implementation
     */
    interface IRouting {

        /**
         * Get the absolute path
         *
         * @param {string} path Path
         * @returns {string}
         */
        getAbsolutePath(path: string): string;

        /**
         * Set page url
         *
         * @param {string} publicationId Publication id
         * @param {string} publicationTitle Publication title
         * @param {string} pageId Page id
         * @param {string} pageTitle Page title
         */
        setPageUrl(publicationId: string, publicationTitle: string,
            pageId: string, pageTitle: string): void;

        /**
         * Get the current location within a publication
         *
         * @returns {IPublicationLocation}
         */
        getPublicationLocation(): IPublicationLocation;
    }
}
