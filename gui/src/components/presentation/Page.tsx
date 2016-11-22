import "./styles/Page";
import "../../../dist/dita-ot/styles/commonltr";
import "../../../dist/dita-ot/styles/commonrtl";

// Global Catalina dependencies
import ActivityIndicator = SDL.ReactComponents.ActivityIndicator;
import ValidationMessage = SDL.ReactComponents.ValidationMessage;

/**
 * Regex to validate if a url is an item Url
 *
 * example: /1656863/164363/publication-mp330/speed-dialling
 */
const ITEM_URL_REGEX = /^\/\d+(\/[^\/]+(\/[^\/]+(\/[^\/]+)?)?)?$/i;

/**
 * Page component props
 *
 * @export
 * @interface IPageProps
 */
export interface IPageProps {
    /**
     * Show activity indicator
     *
     * @type {boolean}
     */
    showActivityIndicator: boolean;
    /**
     * Page content
     *
     * @type {string | null}
     */
    content?: string | null;
    /**
     * An error prevented the page from rendering
     *
     * @type {string | null}
     */
    error?: string | null;
    /**
     * Called whenever navigation to another page is requested
     *
     * @param {string} url Url
     *
     * @memberOf IPageProps
     */
    onNavigate(url: string): void;
}

/**
 * Page component
 */
export class Page extends React.Component<IPageProps, {}> {

    private _hyperlinks: { element: HTMLElement, handler: (e: Event) => void; }[] = [];

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     *
     * @memberOf Page
     */
    public render(): JSX.Element {
        const props = this.props;
        return (
            <div className={"sdl-dita-delivery-page"}>
                {props.showActivityIndicator ? <ActivityIndicator /> : null}
                {props.error ? <ValidationMessage messageType={SDL.UI.Controls.ValidationMessageType.Error} message={props.error} /> : null}
                <div>
                    <div className={"page-content ltr"} dangerouslySetInnerHTML={{ __html: props.content || "" }} />
                </div>
            </div>
        );
    }

    /**
     * Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
     */
    public componentDidMount(): void {
        this._enableHyperlinks();
    }

    /**
     * Invoked immediately after the component's updates are flushed to the DOM. This method is not called for the initial render.
     *
     * @memberOf Page
     */
    public componentDidUpdate(): void {
        this._enableHyperlinks();
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount(): void {
        this._disableHyperlinks();
    }

    /**
     * Make hyperlinks navigate when clicked
     *
     * @private
     *
     * @memberOf Page
     */
    private _enableHyperlinks(): void {
        const props = this.props;
        const domNode = ReactDOM.findDOMNode(this);
        const anchors = domNode.querySelectorAll("a");
        const hyperlinks = this._hyperlinks;
        for (let i: number = 0, length: number = anchors.length; i < length; i++) {
            const anchor = anchors.item(i);
            const alreadyAdded = hyperlinks.filter(hyperlink => hyperlink.element === anchor).length === 1;
            if (!alreadyAdded) {
                const itemUrl = anchor.getAttribute("href");
                if (itemUrl && itemUrl.match(ITEM_URL_REGEX)) {
                    const onClick = (e: Event): void => {
                        if (itemUrl) {
                            props.onNavigate(itemUrl);
                        }
                        e.preventDefault();
                    };
                    hyperlinks.push({
                        element: anchor,
                        handler: onClick
                    });
                    anchor.addEventListener("click", onClick);
                }
            }
        }
    }

    /**
     * Make hyperlinks navigation disabled
     *
     * @private
     *
     * @memberOf Page
     */
    private _disableHyperlinks(): void {
        this._hyperlinks.forEach(anchor => {
            const itemUrl = anchor.element.getAttribute("data-url");
            if (itemUrl) {
                anchor.element.setAttribute("href", itemUrl);
            }
            anchor.element.removeEventListener("click", anchor.handler);
        });
    }
}
