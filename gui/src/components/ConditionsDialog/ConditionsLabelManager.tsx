import * as React from "react";
import { ICondition } from "store/reducers/conditions/IConditions";
import { LabelManager } from "@sdl/controls-react-wrappers";
import { TagsTreeView, ILabelManagerTreeViewNode, IFilteredTreeViewNode, ITreeViewNode, ILabelManagerItem, ITypeaheadSuggestion } from "@sdl/controls";
import { localization } from "services/common/LocalizationService";

import "./ConditionsLabelManager.less";

/**
 * Conditional Label Manager interface
 *
 * @export
 * @interface IDrodownProps
 */
export interface IConditionalLabelManagerProps {
    condition: ICondition;
    onChange: (object: {}[]) => void;
}

export const ConditionsLabelManager: React.StatelessComponent<IConditionalLabelManagerProps> = (props: IConditionalLabelManagerProps): JSX.Element => {
    const { condition, onChange } = props;

    const getTranslation = (query: string): string => {
        return localization.formatMessage(query);
    };

    const id2item = (id: ILabelManagerItem) => ({
        id: id.id || id.label,
        label: id.id || id.label,
        description: id.id || id.label,
        isInvalid: false
    });

    return <LabelManager
        value={condition.values.join()}
        itemData={(item: ILabelManagerItem, callback: (itemData: ILabelManagerItem | null) => void): void => callback(id2item(item))}
        typeahead={{
            load: (query: string, callback: (result: ITypeaheadSuggestion[]) => void): void => {
                const filtered = condition.values.filter(value => value.indexOf(query) >= 0);
                callback(filtered.map((value: string) => ({
                    label: value,
                    description: value
                })));
            },
            templates: {}
        }}
        tagsTreeView={{
            load: (query: string, callback: (rootNodes: IFilteredTreeViewNode[]) => void): void => {
                const nodes: ILabelManagerTreeViewNode[] = [];

                condition.values.forEach(function (value: string): void {
                    const childNodes: ILabelManagerTreeViewNode[] = [];
                    const rootNode: ILabelManagerTreeViewNode =
                        TagsTreeView.createTagsTreeViewNodeFromObject({
                            id: value,
                            name: value,
                            parent: null,
                            children: null,
                            isLeafNode: childNodes.length === 0,
                            load: (node: ITreeViewNode, _callback: (nodes: ITreeViewNode[]) => void): void => {
                                _callback(childNodes);
                            },
                            isSelectable: true
                        });
                    rootNode.isLeafNode = true;
                    rootNode.description = value;
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
};