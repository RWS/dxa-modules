import * as React from "react";
import { LabelManager } from "@sdl/controls-react-wrappers";
import { TagsTreeView, ILabelManagerItem, ILabelManagerTreeViewNode, ILabelManagerTagsTreeViewCount,
    ITypeaheadSuggestion, IFilteredTreeViewNode, ITreeViewNode } from "@sdl/controls";
import Dialog, { IRequestHandler } from "components/presentation/Dialog/Dialog";
import { localization } from "services/common/LocalizationService";
import I18n from "components/helpers/I18n";
import "./ConditionsDialog.less";
import "./LabelManager.less";

export interface IConditionsDialogPresentationProps {
    open: boolean;

    requestOpen: IRequestHandler;
    requestClose: IRequestHandler;
}

interface ICountry {
    id: string;
    label: string;
    description: string;
    cities: ICity[];
}

interface ICity {
    id: string;
    label: string;
    description: string;
}

// Create dummy data
let countries: ICountry[] = [];
for (let i = 1; i < 101; i++) {
    const country: ICountry = {
        id: i.toString(),
        cities: [],
        description: "Country " + i,
        label: "Country " + i
    };

    for (let j = 1; j < 6; j++) {
        const city: ICity = {
            id: ((i * 10) + j).toString(),
            description: "City " + i + j,
            label: "City " + i + j
        };
        country.cities.push(city);
    }

    countries.push(country);
}

const getItemData = (item: ILabelManagerItem, callback: (itemData: ILabelManagerItem | null) => void): void => {
    let result: ILabelManagerItem | null = null;
    countries.forEach(function (country: ICountry): void {
        country.cities.forEach((city) => {
            if (city.id === item.id) {
                result = {
                    description: city.description,
                    id: city.id,
                    isInvalid: false,
                    label: city.label
                };
            }
        });
        if (country.id === item.id) {
            result = {
                description: country.description,
                id: country.id,
                isInvalid: false,
                label: country.label
            };
        }
    });
    if (!result && item.id !== "") {
        result = {
            description: "Tag cannot be resolved!",
            id: item.id,
            isInvalid: true,
            label: item.id
        };
    }

    // Fake timeout for activity indicator
    setTimeout(function(): void {
        callback(result);
    }, 1000);
};

const getSuggestions = (query: string, callback: (result: ITypeaheadSuggestion[]) => void): void => {
    let filteredResult: ITypeaheadSuggestion[] = [];
    countries.forEach(function (country: ICountry): void {
        country.cities.forEach((city) => {
            if (city.label.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                filteredResult.push(city);
            }
        });
        if (country.label.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
            filteredResult.push(country);
        }
    });

    // Sort the results
    filteredResult = filteredResult.sort((a: ITypeaheadSuggestion, b: ITypeaheadSuggestion): number => {
        const aLabel: string = a.label.toLowerCase();
        const bLabel: string = b.label.toLowerCase();
        return ((aLabel < bLabel) ? -1 : ((aLabel > bLabel) ? 1 : 0));
    });

    // Fake timeout for activity indicator
    setTimeout(function(): void {
        callback(filteredResult);
    }, 1000);
};

const getRootNodes = (query: string, callback: (rootNodes: IFilteredTreeViewNode[]) => void): void => {
    const nodes: ILabelManagerTreeViewNode[] = [];
    countries.forEach(function (country: ICountry): void {
        const childNodes: ILabelManagerTreeViewNode[] = [];
        const rootNode: ILabelManagerTreeViewNode =
            TagsTreeView.createTagsTreeViewNodeFromObject({
                id: country.id.toString(),
                name: country.label,
                parent: null,
                children: null,
                isLeafNode: childNodes.length === 0,
                load: (node: ITreeViewNode, _callback: (nodes: ITreeViewNode[]) => void): void => {
                    _callback(childNodes);
                },
                isSelectable: true
            });
        country.cities.forEach((city: ICity): void => {
            const childNode: ILabelManagerTreeViewNode =
                TagsTreeView.createTagsTreeViewNodeFromObject({
                    id: city.id.toString(),
                    name: city.label,
                    parent: rootNode,
                    children: null,
                    isLeafNode: true,
                    load: () => {},
                    isSelectable: true
                });
            // Set description
            childNode.description = city.description;
            // Check if the city matches the query
            if (childNode.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                childNodes.push(childNode);
            }
        });
        // Update leaf property
        rootNode.isLeafNode = childNodes.length === 0;
        // Set description
        rootNode.description = country.description;
        // Check if the label matches the query or any of the children matched the query
        if (rootNode.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
            nodes.push(rootNode);
        }
    });
    // Fake timeout for activity indicator
    setTimeout(function (): void {
        callback(nodes);
    }, 1000);
};

const getSelectableNodesCount = (query: string): ILabelManagerTagsTreeViewCount => {
    let matchingQuery: number = 0;
    let total: number = countries.length;
    countries.forEach(function (country: ICountry): void {
        total += country.cities.length;
        country.cities.forEach((city: ICity) => {
            if (city.label.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                matchingQuery++;
            }
        });
        if (country.label.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
            matchingQuery++;
        }
    });
    return {
        matchingQuery: matchingQuery,
        total: total
    };
};

const getTranslation = (query: string): string => {
    return localization.formatMessage(query);
};

const EventHandler = (object: {}[]): void => {
    console.log("Change", object);
};

const actions = (props: IConditionsDialogPresentationProps) => <div className="sdl-conditions-dialog-actions">
    <button className="sdl-button graphene sdl-button-purpose-confirm">Personalize</button>
    <span className="sdl-button-separator"> </span>
    <button
        onClick={props.requestClose}
        className="sdl-button graphene sdl-button-purpose-general">Cancel</button>
</div>;

const title = (props: IConditionsDialogPresentationProps) => <div className="sdl-conditions-dialog-top-bar">
    <h3><I18n data="components.conditions.dialog.title" /></h3>
    <p><I18n data="components.conditions.dialog.description" /></p>
</div>;

export const ConditionsDialogPresentation = (props: IConditionsDialogPresentationProps) => (
    <div className="sdl-conditions-dialog-presentation">
        <button
            className="sdl-button-text sdl-personalize-content"
            onClick={props.requestOpen}>
            <I18n data="components.conditions.dialog.title" />
        </button>
        <Dialog
            actions={actions(props)}
            title={title(props)}
            open={props.open}
            onRequestClose={props.requestClose}>
            <p>text</p>
            <p>
                <LabelManager
                    value="2"
                    itemData={getItemData}
                    typeahead={{
                        load: getSuggestions,
                        templates: {}
                    }}
                    tagsTreeView={{
                        load: getRootNodes,
                        getSelectableNodesCount: getSelectableNodesCount
                    }}
                    resources={{
                        culture: "en",
                        getTranslation: getTranslation
                    }}
                    onChange={EventHandler}
                />
            </p>
            <p>text</p>
            <p>text</p>
        </Dialog>
    </div>
);