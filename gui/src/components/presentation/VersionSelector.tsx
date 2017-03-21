import * as React from "react";
import { IAppContext } from "components/container/App";
import { Url } from "utils/Url";
import { DropdownList } from "sdl-controls-react-wrappers";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";

import "./styles/VersionSelector";

/**
 * VersionSelector props
 *
 * @export
 * @interface IVersionSelectorProps
 */
export interface IVersionSelectorProps {
    productFamily: string;
    selectedProductReleaseVersion?: string;
    productReleaseVersions: IProductReleaseVersion[];
}

/**
 * VersionSelector
 */
export const VersionSelector: React.StatelessComponent<IVersionSelectorProps> =
    (props: IVersionSelectorProps, context: IAppContext): JSX.Element => {
        const { selectedProductReleaseVersion, productReleaseVersions, productFamily } = props;
        const { formatMessage } = context.services.localizationService;
        const { router } = context;
        return (
            <div className="sdl-dita-delivery-version-selector">
                <label>{formatMessage("productreleaseversions.version.label")}</label>
                <DropdownList propertyMappings={{ "text": "title" }}
                    selectedValue={selectedProductReleaseVersion
                        ? selectedProductReleaseVersion.trim().toLowerCase() : undefined}
                    options={productReleaseVersions || []}
                    onChange={releaseVersion => {
                        if (router) {
                            router.push(Url.getProductFamilyUrl(productFamily, releaseVersion));
                        }
                    }} />
            </div>
        );
    };

VersionSelector.contextTypes = {
    services: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
} as React.ValidationMap<IAppContext>;
