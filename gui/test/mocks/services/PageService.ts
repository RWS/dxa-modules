import { IPageService } from "services/interfaces/PageService";
import { IPage } from "interfaces/Page";
import { Promise } from "es6-promise";
import { IPostComment } from "interfaces/Comments";
import { IComment } from "interfaces/ServerModels";

import { ASYNC_DELAY } from "test/Constants";

let fakeDelay = false;

export class PageService implements IPageService {

    private _mockDataPage: {
        error: string | null;
        info: IPage | undefined;
    } = {
        error: null,
        info: {
            id: "12345",
            content: "<span>Page content!</span>",
            title: "Page title!",
            sitemapIds: null
        }
    };

    private _mockDataComments: {
        values: IComment[];
        error: string | null
    } = {
        values: [],
        error: null
    };

    public getPageInfo(publicationId: string, pageId: string): Promise<IPage> {
        const { error, info } = this._mockDataPage;
        if (fakeDelay) {
            return new Promise((resolve: (info?: IPage) => void, reject: (error: string | null) => void) => {
                setTimeout((): void => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(info);
                    }
                }, ASYNC_DELAY);
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(info);
            }
        }
    }

    public getComments(publicationId: string, pageId: string, descending: boolean, top: number, skip: number, status: number[]): Promise<IComment[]> {
        const { error, values } = this._mockDataComments;
        if (fakeDelay) {
            return new Promise((resolve: (values?: IComment[]) => void, reject: (error: string | null) => void) => {
                setTimeout((): void => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(values);
                    }
                }, ASYNC_DELAY);
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(values);
            }
        }
    }

    public saveComment(data: IPostComment): Promise<IComment> {
        const { error, values } = this._mockDataComments;
        if (fakeDelay) {
            return new Promise((resolve: (value?: IComment)  => void, reject: (error: string | null) => void) => {
                setTimeout((): void => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(values[0]);
                    }
                }, ASYNC_DELAY);
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(values[0]);
            }
        }
    }

    public setMockDataPage(error: string | null, info?: IPage): void {
        this._mockDataPage = {
            error: error,
            info: info
        };
    }

    public fakeDelay(value: boolean): void {
        fakeDelay = value;
    }

}
