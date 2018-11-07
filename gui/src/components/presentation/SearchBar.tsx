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
import "components/presentation/styles/SearchBar";
import { KeyCodes } from "utils/Keys";

/**
 * Search bar component props
 *
 * @export
 * @interface ISearchBarProps
 */
export interface ISearchBarProps {
    /**
     * Called whenever a search is requested
     *
     * @memberOf ISearchBarProps
     */
    onSearch?: (query: string) => void;

    /**
     * Called whenever a search gets active
     *
     * @memberOf ISearchBarProps
     */
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    /**
     * Called whenever a search looses its focus
     *
     * @memberOf ISearchBarProps
     */
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;

    /**
     * Placeholder label
     *
     * @type {string}
     * @memberOf ISearchBarProps
     */
    placeholderLabel: string;
}

/**
 * Search bar component
 */
export const SearchBar: React.StatelessComponent<ISearchBarProps> = (props: ISearchBarProps): JSX.Element => {
    let _input: HTMLInputElement;

    function _onKeyUp(e: React.KeyboardEvent<HTMLInputElement>): void {
        if (e.keyCode === KeyCodes.ESC) {
            // Blur
        } else if (e.keyCode === KeyCodes.Enter) { // Enter key
            _search();
        }
    }

    function _search(): void {
        const searchQuery = _input.value;
        if ((typeof props.onSearch === "function") && searchQuery) {
            props.onSearch(_input.value);
        }
    }

    return (
        <div className="sdl-dita-delivery-searchbar">
            <div className="input-area">
                <input type="text"
                    placeholder={props.placeholderLabel}
                    ref={(input: HTMLInputElement) => _input = input}
                    onKeyUp={_onKeyUp}
                    onFocus={props.onFocus}
                    onBlur={props.onBlur}
                />
                <div className="search-button" onClick={_search} />
            </div>
        </div>
    );
};
