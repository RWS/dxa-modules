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

import * as React from "react";
import * as PropTypes from "prop-types";
import { IAppContext } from "@sdl/dd/container/App/App";
import { DropdownList } from "@sdl/controls-react-wrappers";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { String } from "utils/String";

import "./styles/VersionSelector";
import "components/controls/styles/DropdownList";

/**
 * VersionSelector props
 *
 * @export
 * @interface IVersionSelectorProps
 */
export interface IVersionSelectorProps {
    selectedProductReleaseVersion?: string;
    productReleaseVersions: IProductReleaseVersion[];
    onChange: (productReleaseVersion: string) => void;
}

/**
 * VersionSelector
 */
export const VersionSelector: React.StatelessComponent<IVersionSelectorProps> =
    (props: IVersionSelectorProps, context: IAppContext): JSX.Element => {
        const { selectedProductReleaseVersion, productReleaseVersions, onChange } = props;
        const { formatMessage } = context.services.localizationService;
        return (
            <div className="sdl-dita-delivery-version-selector">
                <label>{formatMessage("productreleaseversions.version.label")}</label>
                <DropdownList propertyMappings={{ "text": "title" }}
                    selectedValue={selectedProductReleaseVersion
                        ? String.normalize(selectedProductReleaseVersion) : undefined}
                    options={productReleaseVersions || []}
                    onChange={onChange}
                    skin="graphene" />
            </div>
        );
    };

VersionSelector.contextTypes = {
    services: PropTypes.object.isRequired
} as React.ValidationMap<IAppContext>;
