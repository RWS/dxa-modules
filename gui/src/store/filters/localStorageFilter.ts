import { IState } from "store/interfaces/State";
// TODO: Remove this library
import { StorageAdapter, AdapterCallback } from "redux-localstorage";

// tslint:disable-next-line:no-any
type LocalGenericObject = { [key: string]: any };

/**
 * getStateSubset returns an part of the state by provided paths subset
 *
 * @param {IState} state The state.
 * @param {String[]} paths Paths array.
 *
 * @returns {Object} Subset from state
 */
const getStateSubset = (state: IState, paths: string[]): Object => {
    let subset = {};

    paths.forEach((path: string) => {
        const subPathsSet = path.split("."),
            length = subPathsSet.length;

        let tmpState: LocalGenericObject = state,
            tmpSubset: LocalGenericObject = subset,
            tmpSubPath = null,
            idx: number = 0;

        while ((tmpSubPath = subPathsSet[idx++])) {
            tmpState = tmpState[tmpSubPath];

            if (!tmpState) {
                return;
            }

            if (idx === length) {
                tmpSubset[tmpSubPath] = tmpState;
            } else if (!tmpSubset[tmpSubPath]) {
                tmpSubset[tmpSubPath] = {};
            }

            tmpSubset = tmpSubset[tmpSubPath];
        }
    });

    return subset;
};

export const localStorageFilter = (path: string[]) => {
    return (storage: StorageAdapter<Storage>) =>
        Object.assign({}, storage, {
            put: (key: string, state: IState, callback: AdapterCallback) => {
                storage.put(key, getStateSubset(state, path), callback);
            }
        });
};
