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
