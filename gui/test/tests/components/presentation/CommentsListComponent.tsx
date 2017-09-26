import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { Provider } from "react-redux";
import { configureStore } from "store/Store";
import { IState } from "store/interfaces/State";
import { Store } from "redux";
import { ICommentsListProps, CommentsListPresentation, DEFAULT_AMOUNT } from "@sdl/dd/CommentsList/CommentsListPresentation";
import { IComment, IUser, ICommentDate } from "interfaces/ServerModels";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "@sdl/models";
import { RENDER_DELAY } from "test/Constants";

class CommentsListComponent extends TestBase {
    public runTests(): void {
        describe(`CommentsList component tests.`, (): void => {
            const target = super.createTargetElement();
            const user: IUser = {
                id: 1,
                name: "Tester",
                emailAddress: "tester@sdl.com",
                externalId: ""
            } as IUser;
            const TOTAL_COMPONENTS = 7;
            const createComment = (): IComment => {
                return {
                    id: parseInt(`${Math.random() * 1000}`, 10),
                    namespaceId: 1,
                    itemPublicationId: 1,
                    itemId: 1,
                    itemType: 1,
                    score: 0,
                    status: 0,
                    creationDate: {
                        dayOfMonth: 26,
                        hour: 10,
                        minute: 35,
                        month: "JUNE",
                        monthValue: 6,
                        nano: 0,
                        second: 39,
                        year: 2017,
                        dayOfWeek: "MONDAY",
                        dayOfYear: 177
                    } as ICommentDate,
                    lastModifiedDate: {
                        dayOfMonth: 26,
                        hour: 10,
                        minute: 35,
                        month: "JUNE",
                        monthValue: 6,
                        nano: 0,
                        second: 39,
                        year: 2017,
                        dayOfWeek: "MONDAY",
                        dayOfYear: 177
                    } as ICommentDate,
                    content: "Test comment",
                    moderator: "",
                    moderatedDate: {
                        dayOfMonth: 26,
                        hour: 10,
                        minute: 35,
                        month: "JUNE",
                        monthValue: 6,
                        nano: 0,
                        second: 39,
                        year: 2017,
                        dayOfWeek: "MONDAY",
                        dayOfYear: 177
                    } as ICommentDate,
                    parentId: 0,
                    parent: {} as IComment,
                    children: [],
                    user: user,
                    idLong: 0
                } as IComment;
            };

            const defaultProps = {
                comments: Array(TOTAL_COMPONENTS)
                    .join(",")
                    .split(",")
                    .map(() => createComment()),
                publicationId: "1",
                pageId: "1",
                error: ""
            };

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("renders component", (): void => {
                const commentsList = this._renderComponent(defaultProps, target);
                const commentsListNode = ReactDOM.findDOMNode(commentsList);
                const title = commentsListNode.querySelector(".sdl-dita-delivery-comments-list > span");
                const renderedComments = commentsListNode.querySelectorAll(".sdl-dita-delivery-comment");
                const loadMoreButton = commentsListNode.querySelector(".sdl-dita-delivery-comments-list-more > button") as HTMLButtonElement;

                expect(commentsList).not.toBeNull();
                expect(loadMoreButton).not.toBeNull();
                expect(title && title.textContent).toBe(`mock-components.commentslist.comments${defaultProps.comments.length}`);
                expect(renderedComments.length).toBe(DEFAULT_AMOUNT);
            });

            it("renders component error", (): void => {
                const commentsList = this._renderComponent({ ...defaultProps, error: "Error message" }, target);
                expect(commentsList).not.toBeNull();
                const commentsListNode = ReactDOM.findDOMNode(commentsList);

                const errorNode = commentsListNode.querySelector(".sdl-dita-delivery-error") as HTMLElement;
                const errorButton = errorNode.querySelectorAll(".sdl-button") as NodeListOf<HTMLButtonElement>;
                expect(errorNode).not.toBeNull();
                expect(errorButton.length).toBe(1);
            });

            it("loads more when load more button is clicked", (): void => {
                const commentsList = this._renderComponent(defaultProps, target);
                const commentsListNode = ReactDOM.findDOMNode(commentsList);
                let loadMoreButton = commentsListNode.querySelector(".sdl-dita-delivery-comments-list-more > button") as HTMLButtonElement;
                expect(loadMoreButton).not.toBeNull();

                loadMoreButton.click();

                const renderedComments = commentsListNode.querySelectorAll(".sdl-dita-delivery-comment");
                expect(renderedComments.length).toBe(TOTAL_COMPONENTS);

                loadMoreButton = commentsListNode.querySelector(".sdl-dita-delivery-comments-list-more > button") as HTMLButtonElement;
                expect(loadMoreButton).toBeNull();
            });

            it("can expand/colapse comment post reply dialog", (done: () => void): void => {
                const commentsList = this._renderComponent(defaultProps, target);

                const comment = TestUtils.scryRenderedDOMComponentsWithClass(commentsList, "sdl-dita-delivery-comment")[0];
                expect(comment).not.toBeNull();

                const replyButtonNode = comment.querySelector("button") as HTMLButtonElement;
                expect(replyButtonNode).toBeDefined();
                TestUtils.Simulate.click(replyButtonNode);

                setTimeout((): void => {
                    expect(comment.querySelector(".sdl-textarea")).toBeDefined();
                    TestUtils.Simulate.click(replyButtonNode);
                    setTimeout((): void => {
                        expect(comment.querySelector(".sdl-textarea")).toBeNull();
                        done();
                    }, RENDER_DELAY);
                }, RENDER_DELAY);

                // Reset functionality is not available yet. TestUtils.Simulate.reset() is no supported.
            });

            it("can expand/colapse comment replies", (done: () => void): void => {
                const repliesCount = 3;
                const nestedProps = { ...defaultProps };
                nestedProps.comments[2].children = Array(repliesCount)
                    .join(",")
                    .split(",")
                    .map(() => createComment());
                const commentsList = this._renderComponent(defaultProps, target);

                const comment = TestUtils.scryRenderedDOMComponentsWithClass(commentsList, "sdl-dita-delivery-comment")[2];
                expect(comment).not.toBeNull();

                const showReplyButtonNode = comment.querySelectorAll("button")[1] as HTMLElement;
                expect(showReplyButtonNode).toBeDefined();
                TestUtils.Simulate.click(showReplyButtonNode);

                setTimeout((): void => {
                    expect(comment.querySelectorAll(".sdl-dita-delivery-comment").length).toBe(repliesCount);
                    TestUtils.Simulate.click(showReplyButtonNode);
                    setTimeout((): void => {
                        expect(comment.querySelectorAll(".sdl-dita-delivery-comment").length).toBe(0);
                        done();
                    }, RENDER_DELAY);
                }, RENDER_DELAY);
            });
        });
    }

    private _renderComponent(props: ICommentsListProps, target: HTMLElement): ComponentWithContext {
        const store: Store<IState> = configureStore();
        return ReactDOM.render(
            <ComponentWithContext>
                <Provider store={store}>
                    <CommentsListPresentation {...props} />
                </Provider>
            </ComponentWithContext>,
            target
        ) as ComponentWithContext;
    }
}

new CommentsListComponent().runTests();
