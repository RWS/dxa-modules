import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { CommentsSection } from "@sdl/dd/CommentsSection/CommentsSection";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "@sdl/models";
import { Provider } from "react-redux";
import { configureStore } from "store/Store";
import { Store } from "redux";
import { IState } from "store/interfaces/State";
import { updateCurrentLocation } from "src/store/actions/Actions";
import { PageService } from "test/mocks/services/PageService";
import { IComment, ICommentDate, IUser } from "interfaces/ServerModels";
import { getComments, getPostCommentErrorMessage } from "store/reducers/Reducer";

import { ASYNC_TEST_DELAY } from "test/Constants";

const services = {
    pageService: new PageService()
};

class CommentsSectionComponent extends TestBase {
    private store: Store<IState>;

    public runTests(): void {
        describe(`CommentsSection component tests.`, (): void => {
            const target = super.createTargetElement();

            const defaultProps = {
                publicationId: "1",
                pageId: "1"
            };

            beforeEach(() => {
                const store = (this.store = configureStore());
                store.dispatch(updateCurrentLocation(defaultProps.publicationId, defaultProps.pageId, "", ""));
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

            it("renders component", (): void => {
                const commentsSection = this._renderComponent(target);
                const commentsSectionNode = ReactDOM.findDOMNode(commentsSection);
                const commentsListNode = commentsSectionNode.querySelector(".sdl-dita-delivery-comments-list");
                const postCommentNode = commentsSectionNode.querySelector(".sdl-dita-delivery-postcomment");

                expect(commentsListNode).not.toBeNull();
                expect(postCommentNode).not.toBeNull();
            });

            it("handles save comment action", (done: () => void): void => {
                const testComment = {
                    id: 42,
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
                services.pageService.setMockDataComments(null, [testComment]);

                const commentsSection = this._renderComponent(target);

                TestUtils.Simulate.submit(TestUtils.findRenderedDOMComponentWithTag(
                    commentsSection,
                    "form"
                ) as HTMLFormElement);

                setTimeout((): void => {
                    expect(
                        getComments(this.store.getState(), defaultProps.publicationId, defaultProps.pageId)[0].id
                    ).toBe(testComment.id);
                    done();
                }, ASYNC_TEST_DELAY);
            });

            it("handles save comment error action", (done: () => void): void => {
                const testCommentError = "Comment #42 Can not be saved";
                services.pageService.setMockDataComments(testCommentError);

                const commentsSection = this._renderComponent(target);

                TestUtils.Simulate.submit(TestUtils.findRenderedDOMComponentWithTag(
                    commentsSection,
                    "form"
                ) as HTMLFormElement);

                setTimeout((): void => {
                    expect(
                        getPostCommentErrorMessage(
                            this.store.getState(),
                            defaultProps.publicationId,
                            defaultProps.pageId
                        )
                    ).toBe(testCommentError);
                    done();
                }, ASYNC_TEST_DELAY);
            });
        });
    }

    private _renderComponent(target: HTMLElement): ComponentWithContext {
        const store = this.store as Store<IState>;
        return ReactDOM.render(
            <ComponentWithContext {...services}>
                <Provider store={store}>
                    <CommentsSection />
                </Provider>
            </ComponentWithContext>,
            target
        ) as ComponentWithContext;
    }
}

new CommentsSectionComponent().runTests();
