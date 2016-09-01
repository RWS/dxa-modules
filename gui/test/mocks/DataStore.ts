
module Sdl.DitaDelivery.Tests.Mocks {
    import ISitemapItem = Server.Models.ISitemapItem;
    import IPageInfo = Sdl.DitaDelivery.Models.IPageInfo;
    import IPublication = Server.Models.IPublication;

    let fakeDelay = false;
    const DELAY = 100;

    export class DataStore implements IDataStore {

        private _mockDataPublications: {
            error: string;
            publications: IPublication[];
        } = {
            error: null,
            publications: []
        };

        private _mockDataPage: {
            error: string;
            info: IPageInfo;
        } = {
            error: null,
            info: {
                content: "<span>Page content!</span>",
                title: "Page title!"
            }
        };

        private _mockDataToc: {
            error: string;
            children: ISitemapItem[]
        } = {
            error: null,
            children: []
        };

        public getPublications(callback: (error: string, publications?: IPublication[]) => void): void {
            const { error, publications } = this._mockDataPublications;
            callback(error, publications);
        }

        public getSitemapRoot(callback: (error: string, children: ISitemapItem[]) => void): void {
            return this.getSitemapItems("root", callback);
        }

        public getSitemapItems(parentId: string, callback: (error: string, children?: ISitemapItem[]) => void): void {
            const { error, children } = this._mockDataToc;
            if (fakeDelay) {
                setTimeout(() => {
                    callback(error, children);
                }, DELAY);
                return;
            }
            callback(error, children);
        }

        public getPageInfo(pageId: string, callback: (error: string, info?: IPageInfo) => void): void {
            const { error, info } = this._mockDataPage;
            if (fakeDelay) {
                setTimeout(() => {
                    callback(error, info);
                }, DELAY);
                return;
            }
            callback(error, info);

        }

        public getPublicationTitle(publicationId: string, callback: (error: string, title?: string) => void): void {
            callback(null, "MP330");
        }

        /**
         * Get the full path for a page
         *
         * @param {string} pageId The page id
         * @param {(error: string, path?: string[]) => void} callback Returns the full path
         */
        public getPagePath(pageId: string, callback: (error: string, path?: string[]) => void): void {
        }

        //#region Custom hooks for testing

        public setMockDataToc(error: string, children?: ISitemapItem[]): void {
            this._mockDataToc = {
                error: error,
                children: children
            };
        }

        public setMockDataPage(error: string, info?: IPageInfo): void {
            this._mockDataPage = {
                error: error,
                info: info
            };
        }

        public fakeDelay(value: boolean): void {
            fakeDelay = value;
        }

        //#endregion
    }
}
