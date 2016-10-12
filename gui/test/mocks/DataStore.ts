
module Sdl.DitaDelivery.Tests.Mocks {
    import ISitemapItem = Server.Models.ISitemapItem;
    import IPageInfo = Sdl.DitaDelivery.Models.IPageInfo;
    import IPublication = Server.Models.IPublication;

    let fakeDelay = false;
    const DELAY = 100;

    export class DataStore implements IDataStore {

        private _mockDataPublications: {
            error: string | null;
            publications: IPublication[];
        } = {
            error: null,
            publications: []
        };

        private _mockDataPage: {
            error: string | null;
            info: IPageInfo | undefined;
        } = {
            error: null,
            info: {
                content: "<span>Page content!</span>",
                title: "Page title!"
            }
        };

        private _mockDataToc: {
            error: string | null;
            items: ISitemapItem[]
        } = {
            error: null,
            items: []
        };

        public getPublications(callback: (error: string | null, publications?: IPublication[]) => void): void {
            const { error, publications } = this._mockDataPublications;
            callback(error, publications);
        }

        public getSitemapRoot(callback: (error: string, items: ISitemapItem[]) => void): void {
            return this.getSitemapItems("root", callback);
        }

        public getSitemapItems(parentId: string, callback: (error: string | null, items?: ISitemapItem[]) => void): void {
            const { error, items } = this._mockDataToc;
            if (fakeDelay) {
                setTimeout(() => {
                    callback(error, items);
                }, DELAY);
                return;
            }
            callback(error, items);
        }

        public getPageInfo(pageId: string, callback: (error: string | null, info?: IPageInfo) => void): void {
            const { error, info } = this._mockDataPage;
            if (fakeDelay) {
                setTimeout(() => {
                    callback(error, info);
                }, DELAY);
                return;
            }
            callback(error, info);

        }

        public getPublicationTitle(publicationId: string, callback: (error: string | null, title?: string) => void): void {
            callback(null, "MP330");
        }

        public getSitemapPath(pageId: string, callback: (error: string | null, path?: string[]) => void): void {
        }

        //#region Custom hooks for testing

        public setMockDataToc(error: string | null, items?: ISitemapItem[]): void {
            this._mockDataToc = {
                error: error,
                items: items || []
            };
        }

        public setMockDataPage(error: string | null, info?: IPageInfo): void {
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
