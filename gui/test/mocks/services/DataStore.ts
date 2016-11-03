import { IDataStore } from "../../../src/services/interfaces/DataStore";
import { ISitemapItem, IPublication } from "../../../src/interfaces/ServerModels";
import { IPageInfo } from "../../../src/models/Page";
import { Promise } from "es6-promise";

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

    private _mockDataPublication: {
        error: string | null,
        title: string | undefined
    } = {
        error: null,
        title: "MP330"
    };
    public getPublications(): Promise<IPublication[]> {
        const { error, publications } = this._mockDataPublications;
        return new Promise((resolve: (publications?: IPublication[]) => void, reject: (error: string | null) => void) => {
            if (error) {
                reject(error);
            } else {
                resolve(publications);
            }
        });
    }

    public getSitemapRoot(publicationId: string): Promise<ISitemapItem[]> {
        return this.getSitemapItems(publicationId);
    }

    public getSitemapItems(publicationId: string, parentId?: string): Promise<ISitemapItem[]> {
        const { error, items } = this._mockDataToc;
        if (fakeDelay) {
            return new Promise((resolve: (items?: ISitemapItem[]) => void, reject: (error: string | null) => void) => {
                setTimeout((): void => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(items);
                    }
                }, DELAY);
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(items);
            }
        }
    }

    public getPageInfo(publicationId: string, pageId: string): Promise<IPageInfo> {
        const { error, info } = this._mockDataPage;
        if (fakeDelay) {
            return new Promise((resolve: (info?: IPageInfo) => void, reject: (error: string | null) => void) => {
                setTimeout((): void => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(info);
                    }
                }, DELAY);
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(info);
            }
        }
    }

    public getPublicationTitle(publicationId: string): Promise<string> {
        const { error, title } = this._mockDataPublication;
        if (fakeDelay) {
            return new Promise((resolve: (info?: string) => void, reject: (error: string | null) => void) => {
                setTimeout((): void => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(title);
                    }
                }, DELAY);
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(title);
            }
        }
    }

    public getSitemapPath(publicationId: string, pageId: string): Promise<ISitemapItem[]> {
        const tocItems = this._mockDataToc.items;
        if (Array.isArray(tocItems)) {
            // Only first level is supported
            const path = tocItems.filter(item => item.Url === pageId);
            return Promise.resolve(path);
        } else {
            return Promise.reject("Unable to resolve path.");
        }
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

    public setMockDataPublication(error: string | null, title?: string): void {
        this._mockDataPublication = {
            error: error,
            title: title
        };
    }
    public fakeDelay(value: boolean): void {
        fakeDelay = value;
    }

    //#endregion
}
