/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import { IPublicationService } from "services/interfaces/PublicationService";
import { IPublication } from "interfaces/Publication";
import { IProductFamily } from "interfaces/ProductFamily";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { Promise } from "es6-promise";
import { IConditionMap } from "store/interfaces/Conditions";

import { ASYNC_DELAY } from "test/Constants";

let fakeDelay = false;

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
        error: string | null;
        title: string;
    } = {
        error: null,
        title: "MP330"
    };

    private _mockDataConditions: {
        values: IConditionMap;
        error: string | null;
    } = {
        values: {},
        error: null
    };

    public getPublications(productFamily?: string, productReleaseVersion?: string): Promise<IPublication[]> {
        const { error, publications } = this._mockDataPublications;
        let filteredPublications = publications;
        if (productFamily) {
            filteredPublications = filteredPublications.filter(
                pub => Array.isArray(pub.productFamily) && pub.productFamily.includes(productFamily)
            );
            if (productReleaseVersion) {
                filteredPublications = filteredPublications.filter(
                    pub =>
                        Array.isArray(pub.productReleaseVersion) &&
                        pub.productReleaseVersion.includes(productReleaseVersion)
                );
            }
        }
        if (fakeDelay) {
            return new Promise(
                (resolve: (publications?: IPublication[]) => void, reject: (error: string | null) => void) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(filteredPublications);
                    }
                }
            );
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
            return new Promise(
                (resolve: (productFamilies?: IProductFamily[]) => void, reject: (error: string | null) => void) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(productFamilies);
                    }
                }
            );
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
                    } else {
                        resolve({
                            ...publication,
                            title
                        });
                    }
                }, ASYNC_DELAY);
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
            return new Promise(
                (
                    resolve: (productReleaseVersions?: IProductReleaseVersion[]) => void,
                    reject: (error: string | null) => void
                ) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(productReleaseVersions);
                    }
                }
            );
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
                    } else {
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

    public setMockDataPublications(
        error: string | null,
        publications: IPublication[] = [],
        productFamilies: IProductFamily[] = [],
        productReleaseVersions: IProductReleaseVersion[] = []
    ): void {
        this._mockDataPublications = {
            error: error,
            publications,
            productFamilies,
            productReleaseVersions
        };
    }

    public setMockDataPublication(error: string | null, title: string = ""): void {
        this._mockDataPublication = {
            error,
            title
        };
    }

    public setMockDataConditions(error: string | null, values: IConditionMap = {}): void {
        this._mockDataConditions = {
            error,
            values
        };
    }

    public fakeDelay(value: boolean): void {
        fakeDelay = value;
    }
}
