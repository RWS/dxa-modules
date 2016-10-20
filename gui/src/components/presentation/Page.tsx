import "./styles/Page";
import "../../../dist/dita-ot/styles/commonltr";
import "../../../dist/dita-ot/styles/commonrtl";

// Global Catalina dependencies
import ActivityIndicator = SDL.ReactComponents.ActivityIndicator;
import ValidationMessage = SDL.ReactComponents.ValidationMessage;

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
     * @param {string} pageId Page id
     *
     * @memberOf IPageProps
     */
    onNavigate(pageId: string): void;
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
        // TODO: only overwrite click behavior on links which are references to other topics
        const anchors = domNode.querySelectorAll("a");
        const hyperlinks = this._hyperlinks;
        for (let i: number = 0, length: number = anchors.length; i < length; i++) {
            const anchor = anchors.item(i);
            const alreadyAdded = hyperlinks.filter(item => item.element === anchor).length > 0;
            if (!alreadyAdded) {
                const onClick = (e: Event): void => {
                    const href = anchor.getAttribute("href");
                    if (href) {
                        props.onNavigate(href);
                        e.preventDefault();
                    }
                };
                hyperlinks.push({
                    element: anchor,
                    handler: onClick
                });
                anchor.addEventListener("click", onClick);
            }
        }
    }

    private _disableHyperlinks(): void {
        this._hyperlinks.forEach(anchor => {
            anchor.element.removeEventListener("click", anchor.handler);
        });
    }

}
