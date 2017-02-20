import { IPublicationService } from "services/interfaces/PublicationService";
import { IPublication } from "interfaces/Publication";
import { IProductFamily } from "interfaces/ProductFamily";

import { Promise } from "es6-promise";

let fakeDelay = false;
const DELAY = 100;

export class PublicationService implements IPublicationService {

    private _mockDataPublications: {
        error: string | null;
        publications: IPublication[];
        productFamilies: IProductFamily[];
    } = {
        error: null,
        publications: [],
        productFamilies: []
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
        if (fakeDelay) {
            return new Promise((resolve: (publications?: IPublication[]) => void, reject: (error: string | null) => void) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(publications);
                }
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(publications);
            }
        }
    }

    public getProductFamilies(): Promise<IProductFamily[]> {
        const { error, productFamilies} = this._mockDataPublications;
        if (fakeDelay) {
            return new Promise((resolve: (productFamilies?: IProductFamily[]) => void, reject: (error: string | null) => void) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(productFamilies);
                }
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(productFamilies);
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

    public setMockDataPublications(error: string | null, publications?: IPublication[], productFamilies?: IProductFamily[]): void {
        this._mockDataPublications = {
            error: error,
            publications: publications || [],
            productFamilies: productFamilies || []
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
}
