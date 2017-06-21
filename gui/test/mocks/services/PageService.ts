import { IPageService } from "services/interfaces/PageService";
import { IPage } from "interfaces/Page";
import { Promise } from "es6-promise";
import { IComment } from "interfaces/Comments";

let fakeDelay = false;
const DELAY = 100;

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
                }, DELAY);
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(values);
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
