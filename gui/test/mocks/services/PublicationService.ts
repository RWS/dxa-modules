import { IPublicationService } from "services/interfaces/PublicationService";
import { IPublication } from "interfaces/Publication";
import { IProductFamily } from "interfaces/ProductFamily";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { Promise } from "es6-promise";
import { IConditionMap } from "store/interfaces/Conditions";

let fakeDelay = false;
const DELAY = 100;

export class PublicationService implements IPublicationService {

    private _mockDataPublications: {
        error: string | null;
        publications: IPublication[];
        productFamilies: IProductFamily[];
        productReleaseVersions: IProductReleaseVersion[];
    } = {
        error: null,
        publications: [],
        productFamilies: [],
        productReleaseVersions: []
    };

    private _mockDataPublication: {
        error: string | null,
        title: string
    } = {
        error: null,
        title: "MP330"
    };

    private _mockDataConditions: {
        values: IConditionMap;
        error: string | null
    } = {
        values: {},
        error: null
    };

    public getPublications(productFamily?: string, productReleaseVersion?: string): Promise<IPublication[]> {
        const { error, publications } = this._mockDataPublications;
        let filteredPublications = publications;
        if (productFamily) {
            filteredPublications = filteredPublications.filter(pub => pub.productFamily === productFamily);
            if (productReleaseVersion) {
                filteredPublications = filteredPublications.filter(pub => pub.productReleaseVersion === productReleaseVersion);
            }
        }
        if (fakeDelay) {
            return new Promise((resolve: (publications?: IPublication[]) => void, reject: (error: string | null) => void) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(filteredPublications);
                }
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(filteredPublications);
            }
        }
    }

    public getProductFamilies(): Promise<IProductFamily[]> {
        const { error, productFamilies } = this._mockDataPublications;
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

    public getPublicationById(publicationId: string): Promise<IPublication> {
        const { error, title } = this._mockDataPublication;
        const publication = this._mockDataPublications.publications.filter(pub => pub.id === publicationId)[0];
        if (fakeDelay) {
            return new Promise((resolve: (info?: IPublication) => void, reject: (error: string | null) => void) => {
                setTimeout((): void => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve({
                            ...publication,
                            title
                        });
                    }
                }, DELAY);
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve({
                    ...publication,
                    title
                });
            }
        }
    }

    public getProductReleaseVersions(productFamily: string): Promise<IProductReleaseVersion[]> {
        const { error, productReleaseVersions } = this._mockDataPublications;
        if (fakeDelay) {
            return new Promise((resolve: (productReleaseVersions?: IProductReleaseVersion[]) => void, reject: (error: string | null) => void) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(productReleaseVersions);
                }
            });
        } else {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(productReleaseVersions);
            }
        }
    }

    public getProductReleaseVersionsByPublicationId(publicationId: string): Promise<IProductReleaseVersion[]> {
        return this.getProductReleaseVersions("");
    }

    public getConditions(publicationId: string): Promise<IConditionMap> {
        const { error, values } = this._mockDataConditions;
        if (fakeDelay) {
            return new Promise((resolve: (values?: IConditionMap) => void, reject: (error: string | null) => void) => {
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

    public setMockDataPublications(error: string | null, publications?: IPublication[],
        productFamilies?: IProductFamily[], productReleaseVersions?: IProductReleaseVersion[]): void {
        this._mockDataPublications = {
            error: error,
            publications: publications || [],
            productFamilies: productFamilies || [],
            productReleaseVersions: productReleaseVersions || []
        };
    }

    public setMockDataPublication(error: string | null, title?: string): void {
        this._mockDataPublication = {
            error: error,
            title: title || ""
        };
    }
    public fakeDelay(value: boolean): void {
        fakeDelay = value;
    }
}
