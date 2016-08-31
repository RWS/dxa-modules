
module Sdl.DitaDelivery.Tests.Mocks {
    import ISitemapItem = Server.Models.ISitemapItem;
    import IPageInfo = Sdl.DitaDelivery.Models.IPageInfo;

    let fakeDelay = false;
    const DELAY = 100;

    export class DataStore implements IDataStore {

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
    }
}
