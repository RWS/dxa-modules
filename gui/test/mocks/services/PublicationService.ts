import { IPublicationService } from "services/interfaces/PublicationService";
import { IPublication } from "interfaces/ServerModels";
import { Promise } from "es6-promise";

let fakeDelay = false;
const DELAY = 100;

export class PublicationService implements IPublicationService {

    private _mockDataPublications: {
        error: string | null;
        publications: IPublication[];
    } = {
        error: null,
        publications: []
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

    public setMockDataPublication(error: string | null, title?: string): void {
        this._mockDataPublication = {
            error: error,
            title: title
        };
    }
    public fakeDelay(value: boolean): void {
        fakeDelay = value;
    }
}
