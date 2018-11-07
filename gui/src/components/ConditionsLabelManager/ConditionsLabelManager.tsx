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
import { ICondition } from "store/interfaces/Conditions";
import { LabelManager } from "@sdl/controls-react-wrappers";
import {
    TagsTreeView,
    ILabelManagerTreeViewNode,
    IFilteredTreeViewNode,
    ITreeViewNode,
    ILabelManagerItem,
    ITypeaheadSuggestion
} from "@sdl/controls";
import { localization } from "services/common/LocalizationService";

import "./ConditionsLabelManager.less";

/**
 * Conditional Label Manager interface
 *
 * @export
 * @interface IConditionalLabelManagerProps
 */
export interface IConditionalLabelManagerProps {
    values?: string[];
    condition: ICondition;
    onChange: (object: {}[]) => void;
}

export const ConditionsLabelManager: React.StatelessComponent<IConditionalLabelManagerProps> = (
    props: IConditionalLabelManagerProps
): JSX.Element => {
    const { condition, values, onChange } = props;

    const getTranslation = (query: string): string => localization.formatMessage(query);

    const id2item = (item: ILabelManagerItem | string) => {
        const id = typeof item === "string" ? item : item.id || item.label;
        return {
            id: id,
            label: id,
            description: id,
            isInvalid: false
        };
    };

    return (
        <LabelManager
            value={values ? values.join() : undefined}
            itemData={(item: ILabelManagerItem, callback: (itemData: ILabelManagerItem | null) => void): void =>
                callback(id2item(item))
            }
            typeahead={{
                load: (query: string, callback: (result: ITypeaheadSuggestion[]) => void): void => {
                    const filtered = condition.values.filter(
                        value => value.toLowerCase().indexOf(query.toLowerCase()) >= 0
                    );
                    callback(
                        filtered.map((value: string) => ({
                            label: value,
                            description: value
                        }))
                    );
                },
                templates: {}
            }}
            tagsTreeView={{
                load: (query: string, callback: (rootNodes: IFilteredTreeViewNode[]) => void): void => {
                    const nodes: ILabelManagerTreeViewNode[] = [];

                    condition.values.forEach(function(value: string): void {
                        const rootNode: ILabelManagerTreeViewNode = TagsTreeView.createTagsTreeViewNodeFromObject({
                            id: value,
                            name: value,
                            parent: null,
                            children: null,
                            isLeafNode: true,
                            load: (node: ITreeViewNode, _callback: (nodes: ITreeViewNode[]) => void): void => {},
                            isSelectable: true
                        });
                        rootNode.description = value;
                        rootNode.isSelected = true;
                        if (rootNode.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                            nodes.push(rootNode);
                        }
                    });
                    callback(nodes);
                }
            }}
            resources={{
                culture: "en",
                getTranslation: getTranslation
            }}
            onChange={onChange}
        />
    );
};
