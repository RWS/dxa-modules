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
    return (
        <div className="sdl-dita-delivery-searchbar">
            <div className="input-area">
                <input type="text" placeholder={props.placeholderLabel}/>
                <div className="search-button"/>
            </div>
        </div>
    );
};
