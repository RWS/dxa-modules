import { IPageService } from "../../../src/services/interfaces/PageService";
import { IPageInfo } from "../../../src/models/Page";
import { Promise } from "es6-promise";

let fakeDelay = false;
const DELAY = 100;

export class PageService implements IPageService {

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

    public setMockDataPage(error: string | null, info?: IPageInfo): void {
        this._mockDataPage = {
            error: error,
            info: info
        };
    }

    public fakeDelay(value: boolean): void {
        fakeDelay = value;
    }

}
