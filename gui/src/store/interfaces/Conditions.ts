// FIX IT: Update with string enum when switch to TypeScript 2.4
export class DataType {
    public static Date: string = "Date";
    public static Text: string = "Text";
}

export interface ICondition {
    values: string[];
    datatype: DataType;
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