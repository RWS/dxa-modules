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
         * Use this hook to be notified on location changes
         *
         * @param {() => void} handler Handler which will be triggered upon a location change.
         */
        onLocationChanged(handler: () => void): void;

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
         * @param {string} sitemapItemId Sitemap item id
         * @param {string} sitemapItemTitle Sitemap item title
         */
        setPublicationLocation(publicationId: string, publicationTitle: string,
            sitemapItemId: string, sitemapItemTitle: string): void;

        /**
         * Get the current location within a publication
         *
         * @returns {IPublicationLocation}
         */
        getPublicationLocation(): IPublicationLocation;
    }

    /**
     * Publication location
     *
     * @interface IPublicationLocation
     */
    interface IPublicationLocation {
        /**
         * Publication id
         *
         * @type {string}
         */
        publicationId: string;
        /**
         * Sitemap item id
         *
         * @type {string}
         */
        sitemapItemId: string;
    }

}
