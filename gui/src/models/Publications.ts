import * as ServerModels from "interfaces/ServerModels";
import { IPublication } from "interfaces/Publication";
import { IProductFamily } from "interfaces/ProductFamily";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { Api } from "utils/Api";
import { Net, IWebRequest, LoadableObject } from "sdl-models";
import { localization } from "services/common/LocalizationService";
import Version from "utils/Version";

/**
 * Publications model
 *
 * @export
 * @class Publications
 * @extends {LoadableObject}
 */
export class Publications extends LoadableObject {

    private _publications: IPublication[];
    private _productFamilies?: IProductFamily[];
    private _unknownProductFamilyTitle: string = localization.formatMessage("productfamilies.unknown.title");
    private _unknownProductFamilyDescription: string = localization.formatMessage("productfamilies.unknown.description");
    private _unknownProductReleaseVersion: string = localization.formatMessage("productreleaseversions.unknown.title");

    /**
     * Get the Publications
     *
     * @param {string} [productFamily] productFamily title
     * @param {string} [productReleaseVersion] product release version title
     * @returns {IPublication[]}
     */
    public getPublications(productFamily?: string, productReleaseVersion?: string): IPublication[] {
        let result: IPublication[] = this._publications.slice();

        if (productFamily) {
            const normalizedProductFamily = productFamily.toLowerCase().trim();
            const familyTitle = (normalizedProductFamily === this._unknownProductFamilyTitle.toLowerCase()) ? undefined : normalizedProductFamily;
            result = result.filter((publication: IPublication) => {
                if (!familyTitle) {
                    return !publication.productFamily;
                }
                return (publication.productFamily && publication.productFamily.toLowerCase().trim()) === familyTitle;
            });
        }

        if (productReleaseVersion) {
            const normalizedProductReleaseVersion = productReleaseVersion.toLowerCase().trim();
            const productReleaseVersionTitle = (normalizedProductReleaseVersion === this._unknownProductReleaseVersion.toLowerCase())
                ? undefined : normalizedProductReleaseVersion;
            result = result.filter((publication: IPublication) => {
                if (!productReleaseVersionTitle) {
                    return !publication.productReleaseVersion;
                }
                const normalizedPublicationProductReleaseVersion = publication.productReleaseVersion && Version.normalize(publication.productReleaseVersion).toLowerCase().trim();
                return normalizedPublicationProductReleaseVersion === productReleaseVersionTitle;
            });
        }

        return result;
    }

    /**
     * Get the Product Release Versions for Product Family
     *
     * @param {string} productFamily productFamily title
     * @returns {IProductReleaseVersion[]}
     */
    public getProductReleaseVersions(productFamily: string): IProductReleaseVersion[] {
        const publicationsList = this.getPublications(productFamily);
        return Version.sortProductReleaseVersions(publicationsList).map(version => this._convertToProductReleaseVersion(version));
    }

    /**
     * Get the Product Release Versions for a publication
     *
     * @param {string} publicationId Publication id
     * @returns {IProductReleaseVersion[]}
     */
    public getProductReleaseVersionsByPublicationId(publicationId: string): IProductReleaseVersion[] | undefined {
        const publicationsList = this.getPublications().filter(pub => pub.id === publicationId);
        const publication = publicationsList[0];
        if (publication) {
            const publicationVersionsList = this.getPublications().filter(pub => pub.logicalId === publication.logicalId);
            return Version.sortProductReleaseVersions(publicationVersionsList).map(version => this._convertToProductReleaseVersion(version));
        }
        return undefined;
    }

    /**
     * Get product families
     *
     * @returns {IProductFamily[]}
     */
    public getProductFamilies(): IProductFamily[] {
        if (!this._productFamilies) {
            const publications = this.getPublications();
            if (publications) {
                let distinctFamilies: (string | undefined)[] = publications.map((publication: IPublication) => {
                    return publication.productFamily || undefined;
                }).filter((family: string, i: number, arr: string[]) => {
                    return arr.indexOf(family) == i;
                });

                // Implementing case in-sensetive sort
                distinctFamilies.sort((left: string | undefined, right: string | undefined) => {
                    return (left || "").toLowerCase().localeCompare((right || "").toLowerCase());
                });

                this._productFamilies = distinctFamilies.map((family: string | undefined): IProductFamily => {
                    if (family === undefined) {
                        return {
                            title: this._unknownProductFamilyTitle,
                            description: this._unknownProductFamilyDescription,
                            hasWarning: true
                        };
                    } else {
                        return {
                            // Only title now, description would go here later on
                            title: family
                        };
                    }
                });
            }
        }
        return this._productFamilies || [];
    }

    /**
     * Get the Product Family for a publication
     *
     * @param {string} publicationId Publication id
     * @returns {IProductFamily | undefined}
     */
    public getProductFamilyByPublicationId(publicationId: string): IProductFamily | undefined {
        var publicationsList = this.getPublications().filter(pub => pub.id === publicationId);
        var publication = publicationsList[0];
        if (publication) {
            var family = publication.productFamily || undefined;
            if (family === undefined) {
                return {
                    title: this._unknownProductFamilyTitle,
                    description: this._unknownProductFamilyDescription,
                    hasWarning: true
                };
            }
            else {
                return {
                    // Only title now, description would go here later on
                    title: family
                };
            }
        }
        return undefined;
    };

    /* Overloads */
    protected _executeLoad(reload: boolean): void {
        const url = Api.getPublicationsUrl();
        Net.getRequest(url,
            this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        this._publications = (JSON.parse(result) as ServerModels.IPublication[]).map((item: ServerModels.IPublication) => {
            return {
                id: item.Id,
                title: item.Title,
                productFamily: item.ProductFamily,
                productReleaseVersion: item.ProductReleaseVersion,
                createdOn: new Date(item.CreatedOn),
                version: item.Version,
                logicalId: item.LogicalId
            } as IPublication;
        });

        this._productFamilies = undefined;

        super._processLoadResult(result, webRequest);
    }

    private _convertToProductReleaseVersion(version: string | null): IProductReleaseVersion {
        if (version === null) {
            return {
                title: this._unknownProductReleaseVersion,
                value: this._unknownProductReleaseVersion.trim().toLowerCase(),
                hasWarning: true
            };
        }
        return {
            title: version,
            value: version.trim().toLowerCase()
        };
    }
}
