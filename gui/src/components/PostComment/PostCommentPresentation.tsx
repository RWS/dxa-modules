import * as React from "react";
import "@sdl/dd/PostComment/styles/PostComment";
import "@sdl/dd/Input/Input";
import "@sdl/dd/Textarea/Textarea";
import { IAppContext } from "@sdl/dd/container/App/App";
import * as ClassNames from "classnames";

export interface IPostCommentPresentationProps {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>, formData: IPostCommentPresentationState) => void;
}

export interface IPostCommentPresentationDispatchProps {
    error: string;
    pageId: string;
    isCommentSaving: boolean;
}

export interface IPostCommentPresentationState {
    name: string;
    email: string;
    comment: string;
    edited: {
        name: boolean;
        email: boolean;
        comment: boolean;
    };
}

export interface IPC {
    [key: string]: boolean;
}

export class PostCommentPresentation extends
    React.Component<IPostCommentPresentationProps & IPostCommentPresentationDispatchProps, IPostCommentPresentationState> {

    /**
     * Context types
     *
     * @static
     * @type {React.ValidationMap<IAppContext>}
     */
    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired
    };

    /**
     * Global context
     *
     * @type {IAppContext}
     */
    public context: IAppContext;

    public form: HTMLFormElement;

    private initialState: IPostCommentPresentationState;

    constructor() {
        super();
        this.initialState = {
            name: "",
            email: "",
            comment: "",
            edited: {
                name: false,
                email: false,
                comment: false
            }
        };
        this.state = this.initialState;

        this.handleBlur = this.handleBlur.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     *
     * @param {React.ChangeEvent} event
     *
     * @memberof PostCommentPresentation
     */
    public handleChange(event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>): void {
        const htmlElement = event.currentTarget;
        this.setState({ ...this.state, [htmlElement.getAttribute("id") as string]: htmlElement.value });
    }

    /**
     *
     * @param {React.FormEvent<HTMLFormElement>} event
     * @memberof PostCommentPresentation
     */
    public handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        this.props.handleSubmit(event, this.state);
        this.form = event.currentTarget;
    }

    /**
     *
     * @param {IPostCommentPresentationDispatchProps} nextProps
     * @memberof PostCommentPresentation
     */
    public componentWillReceiveProps(nextProps: IPostCommentPresentationDispatchProps): void {
        if (!nextProps.isCommentSaving && !nextProps.error) {
            if (this.form) {
                this.form.reset();
            }
            this.resetState();
        }
    }

    /**
     *
     * @param {string} name
     * @param {string} email
     * @param {string} comment
     * @returns {IPC}
     *
     * @memberof PostCommentPresentation
     */
    public validateInput(name: string, email: string, comment: string): IPC {
        return {
            name: name.length === 0,
            email: email.length === 0,
            comment: comment.length === 0
        };
    }

    /**
     *
     * @param {React.FocusEvent} event
     *
     * @memberof PostCommentPresentation
     */
    public handleBlur(event: React.FocusEvent<HTMLElement>): void {
        const field = event.currentTarget.getAttribute("id") as string;
        this.setState({...this.state, edited: { ...this.state.edited, [field]: true }});
    }

    /**
     *
     * @returns {JSX.Element}
     *
     * @memberof PostCommentPresentation
     */
    public render(): JSX.Element {
        const { error } = this.props;
        const {name, email, comment} = this.state;
        const { formatMessage } = this.context.services.localizationService;
        const errors: IPC = this.validateInput(name, email, comment);
        const isDisabled = Object.keys(errors).some(key => errors[key]);

        const isError = (field: string) => {
            const hasError = errors[field];
            const shouldShow = (this.state.edited as IPC)[field];
            return hasError ? shouldShow : false;
        };

        const getInputClassNames = (field: string): string => {
            return ClassNames(
                "sdl-input-text",
                isError(field) ? "error" : ""
            );
        };
        const getTextareaClassNames = (field: string): string => {
            return ClassNames(
                "sdl-textarea",
                isError(field) ? "error" : ""
            );
        };

        return (
            <div className="sdl-dita-delivery-postcomment">
                <form onSubmit={this.handleSubmit} id="form">
                    <div>
                        <label htmlFor="name">{formatMessage("component.post.comment.name")}<span>*</span></label>
                        <input className={getInputClassNames("name")}
                            type="text"
                            id="name"
                            placeholder={formatMessage("component.post.comment.placeholder.name")}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur} />
                        <span>{formatMessage("component.post.comment.no.name")}</span>
                    </div>
                    <div>
                        <label htmlFor="email">{formatMessage("component.post.comment.email")}<span>*</span></label>
                        <input className={getInputClassNames("email")}
                            type="text"
                            id="email"
                            placeholder={formatMessage("component.post.comment.placeholder.email")}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur} />
                        <span>{formatMessage("component.post.comment.no.email")}</span>
                    </div>
                    <div>
                        <label htmlFor="comment">{formatMessage("component.post.comment.content")}<span>*</span></label>
                        <textarea className={getTextareaClassNames("comment")}
                            id="comment"
                            placeholder={formatMessage("component.post.comment.placeholder.content")}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}></textarea>
                        <span>{formatMessage("component.post.comment.no.content")}</span>
                    </div>
                    <button type="submit" disabled={isDisabled} className="sdl-button graphene sdl-button-purpose-confirm" form="form" value="Submit">
                        {formatMessage("component.post.comment.submit")}
                    </button>
                </form>
                {error && <div className="sdl-dita-delivery-postcomment-error" >
                    {formatMessage("component.post.comment.post.error")}
                </div>}
            </div>
        );
    }

    private resetState(): void {
        this.setState(this.initialState);
    }
}
