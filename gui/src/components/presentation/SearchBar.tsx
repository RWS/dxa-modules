import "components/presentation/styles/SearchBar";

/**
 * Search bar component props
 *
 * @export
 * @interface ISearchProps
 */
export interface ISearchProps {
    /**
     * Called whenever a search is requested
     *
     * @memberOf ISearchProps
     */
    onSearch?: (query: string) => void;

    /**
     * Placeholder label
     *
     * @type {string}
     * @memberOf ISearchProps
     */
    placeholderLabel: string;
}

/**
 * Search bar component
 */
export const SearchBar: React.StatelessComponent<ISearchProps> = (props: ISearchProps): JSX.Element => {
    let value = "";

    function _onKeyUp(e: React.KeyboardEvent): void {
        value = (e.nativeEvent.target as HTMLInputElement).value;
        if (e.keyCode === 13) { // Enter key
            _search();
        }
    }

    function _search(): void {
        if (typeof props.onSearch === "function") {
            props.onSearch(value);
        }
    }

    return (
        <div className="sdl-dita-delivery-searchbar">
            <div className="input-area">
                <input type="text" placeholder={props.placeholderLabel} onKeyUp={_onKeyUp} />
                <div className="search-button" onClick={_search} />
            </div>
        </div>
    );
};
