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
}

/**
 * Search bar component
 */
export const SearchBar = (props: ISearchProps): JSX.Element => {
    return (
        <div className="sdl-dita-delivery-searchbar"/>
    );
};
