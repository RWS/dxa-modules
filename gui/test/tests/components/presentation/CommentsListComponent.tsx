import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { Provider } from "react-redux";
import { configureStore } from "store/Store";
import { IState } from "store/interfaces/State";
import { Store } from "redux";
import { DEFAULT_AMOUNT } from "@sdl/dd/CommentsList/CommentsListPresentation";
import { CommentsList } from "@sdl/dd/CommentsList/CommentsList";
import { IComment, IUser, ICommentDate } from "interfaces/ServerModels";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "@sdl/models";
import { RENDER_DELAY } from "test/Constants";
import { updateCurrentPublication } from "src/store/actions/Actions";
import { PageService } from "test/mocks/services/PageService";

const services = {
    pageService: new PageService()
};

class CommentsListComponent extends TestBase {
    private store: Store<IState>;
    public runTests(): void {
        describe(`CommentsList component tests.`, (): void => {
            const target = super.createTargetElement();

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
                    creationDate: {} as ICommentDate,
                    lastModifiedDate: {} as ICommentDate,
                    content: "Test comment",
                    moderator: "",
                    moderatedDate: {} as ICommentDate,
                    parentId: 0,
                    parent: {} as IComment,
                    children: [],
                    user: {} as IUser,
                    idLong: 0
                } as IComment;
            };

            const defaultProps = {
                comments: Array(TOTAL_COMPONENTS)
                    .fill(null)
                    .map(createComment),
                publicationId: "1",
                pageId: "1",
                error: ""
            };

            beforeEach(() => {
                const store = (this.store = configureStore());
                store.dispatch(updateCurrentPublication(defaultProps.publicationId, defaultProps.pageId, ""));
                services.pageService.setMockDataComments(null, defaultProps.comments);
            });

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("renders component", (done: () => void): void => {
                const commentsList = this._renderComponent(target);
                setTimeout((): void => {
                    const commentsListNode = ReactDOM.findDOMNode(commentsList);
                    const title = commentsListNode.querySelector(".sdl-dita-delivery-comments-list > span");
                    const renderedComments = commentsListNode.querySelectorAll(".sdl-dita-delivery-comment");
                    const loadMoreButton = commentsListNode.querySelector(
                        ".sdl-dita-delivery-comments-list-more > button"
                    ) as HTMLButtonElement;
                    expect(commentsList).not.toBeNull();
                    expect(loadMoreButton).not.toBeNull();
                    expect(title && title.textContent).toBe(
                        `mock-components.commentslist.comments${defaultProps.comments.length}`
                    );
                    expect(renderedComments.length).toBe(DEFAULT_AMOUNT);
                    done();
                }, RENDER_DELAY);
            });

            it("renders component error and retries when retry button is clicked", (done: () => void): void => {
                const testError = "Test Error. It can`t render comments list";
                services.pageService.setMockDataComments(testError);

                const commentsList = this._renderComponent(target);
                expect(commentsList).not.toBeNull();
                setTimeout((): void => {
                    const commentsListNode = ReactDOM.findDOMNode(commentsList);
                    const errorButton = commentsListNode.querySelector(
                        ".sdl-dita-delivery-error button.sdl-button"
                    ) as HTMLButtonElement;
                    errorButton.click();
                    done();
                }, RENDER_DELAY);
            });

            it("loads more when load more button is clicked", (done: () => void): void => {
                const commentsList = this._renderComponent(target);

                setTimeout((): void => {
                    const commentsListNode = ReactDOM.findDOMNode(commentsList);
                    let loadMoreButton = commentsListNode.querySelector(
                        ".sdl-dita-delivery-comments-list-more > button"
                    ) as HTMLButtonElement;
                    expect(loadMoreButton).not.toBeNull();
                    loadMoreButton.click();

                    const renderedComments = commentsListNode.querySelectorAll(".sdl-dita-delivery-comment");
                    expect(renderedComments.length).toBe(TOTAL_COMPONENTS);

                    loadMoreButton = commentsListNode.querySelector(
                        ".sdl-dita-delivery-comments-list-more > button"
                    ) as HTMLButtonElement;
                    expect(loadMoreButton).toBeNull();
                    done();
                }, RENDER_DELAY);
            });

            it("can expand/collapse comment post reply dialog", (done: () => void): void => {
                const commentsList = this._renderComponent(target);
                setTimeout((): void => {
                    // Select first Comment
                    const comment = TestUtils.scryRenderedDOMComponentsWithClass(
                        commentsList,
                        "sdl-dita-delivery-comment"
                    )[0];
                    expect(comment).not.toBeNull();
                    const commentOpenReplyButton = comment.querySelector("button") as HTMLButtonElement;

                    // 1. Expand Dialog
                    const expandDialogStep = (onDoneCallBack: () => void): void => {
                        TestUtils.Simulate.click(commentOpenReplyButton);
                        setTimeout((): void => {
                            expect(comment.querySelector(".sdl-textarea")).toBeDefined();
                            onDoneCallBack();
                        }, RENDER_DELAY);
                    };

                    // 4. collapse Dialog
                    const collapseDialogStep = (onDoneCallBack: () => void): void => {
                        TestUtils.Simulate.click(commentOpenReplyButton);
                        setTimeout((): void => {
                            expect(comment.querySelector(".sdl-textarea")).toBeNull();
                            onDoneCallBack();
                        }, RENDER_DELAY);
                    };

                    expandDialogStep(() => {
                        collapseDialogStep(() => {
                            done();
                        });
                    });
                }, RENDER_DELAY);
            });

            it("can post/reset comment post reply", (done: () => void): void => {
                const testCommentIndex = 0;
                const commentsList = this._renderComponent(target);
                setTimeout((): void => {
                    // Select first Comment
                    const comment = TestUtils.scryRenderedDOMComponentsWithClass(
                        commentsList,
                        "sdl-dita-delivery-comment"
                    )[testCommentIndex];
                    expect(comment).not.toBeNull();
                    TestUtils.Simulate.click(comment.querySelector("button") as HTMLButtonElement);

                    // 1. Expand Dialog
                    setTimeout((): void => {
                        const dialogForm = comment.querySelector("form") as HTMLFormElement;
                        expect(dialogForm).toBeDefined();
                        const formId = dialogForm.id;

                        // 2. Reset the form
                        // TestUtils.Simulate.reset is not supported yet, so as reset event propagation.
                        // We can`t test this functionality yet.

                        // 3. Submit the form
                        TestUtils.Simulate.submit(dialogForm);
                        setTimeout((): void => {
                            // On form submit replies should be shown
                            expect(ReactDOM.findDOMNode(commentsList).querySelector(`form#${formId}`) as HTMLFormElement).not.toBeDefined();
                            done();
                        }, RENDER_DELAY);
                    }, RENDER_DELAY);
                }, RENDER_DELAY);
            });

            it("can expand/colapse comment replies", (done: () => void): void => {
                const repliesCount = 3;
                const nestedComments = [ ...defaultProps.comments ];
                nestedComments[2].children = Array(repliesCount)
                    .fill(null)
                    .map(createComment);

                services.pageService.setMockDataComments(null, nestedComments);

                const commentsList = this._renderComponent(target);
                setTimeout((): void => {
                    const comment = TestUtils.scryRenderedDOMComponentsWithClass(
                        commentsList,
                        "sdl-dita-delivery-comment"
                    )[2];
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
                }, RENDER_DELAY);
            });
        });
    }

    private _renderComponent(target: HTMLElement): ComponentWithContext {
        const store = this.store as Store<IState>;
        return ReactDOM.render(
            <ComponentWithContext {...services}>
                <Provider store={store}>
                    <CommentsList />
                </Provider>
            </ComponentWithContext>,
            target
        ) as ComponentWithContext;
    }
}

new CommentsListComponent().runTests();
