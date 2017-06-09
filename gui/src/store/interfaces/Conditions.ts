export interface ICondition {
    values: string[];
    datatype: "Text" | "Date";
    range: boolean;
}

export interface IConditionMap {
    [key: string]: ICondition;
}

export interface IPostConditions {
    [key: string]: string[];
}

export interface IPostConditionRequest {
    publicationId: number;
    userConditions: IPostConditions;
}

export interface IConditionsPayload {
    pubId: string;
    conditions: IConditionMap;
}

export interface IAllConditions {
        byPubId: { [pubId: string]: IConditionMap};
        loading: string[];
        errors: { [pubId: string]: string };
}

export interface ILastConditions {
    [pubId: string]: IConditionMap;
}

export interface IConditionsState {
    showDialog: boolean;
    allConditions: IAllConditions;
    lastConditions: ILastConditions;
    editingConditions: IConditionMap;
}