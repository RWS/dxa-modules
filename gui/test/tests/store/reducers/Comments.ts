import { Store } from "redux";
import { TestBase } from "@sdl/models";
import { configureStore } from "store/Store";
import { IState } from "store/interfaces/State";
import {
    getCommentsKey,
    getComments,
    commentsAreLoading,
    commentIsSaving,
    getCommentErrorMessage,
    getPostCommentErrorMessage
} from "store/reducers/Reducer";
import {
    commentsLoading,
    commentsLoaded,
    commentsError,
    commentSaving,
    commentError,
    commentSaved
} from "store/actions/Api";

import { IComment } from "interfaces/ServerModels";

class CommentsReducer extends TestBase {
    public runTests(): void {
        describe("Test comments reducer.", (): void => {
            let store: Store<IState>;

            const publicationId = "pub-0";
            const pageId = "page-0";
            const commentKey = getCommentsKey(publicationId, pageId);

            //this is basically resets store's state, because of "KARMA_RESET" reducer.
            beforeEach(() => {
                store = configureStore();
            });

            it("Checks default state", () => {
                const state = store.getState();
                expect(getComments(state, publicationId, pageId).length).toBe(
                    0,
                    "Should be empty on init"
                );
                expect(getCommentErrorMessage(state, publicationId, pageId)).toBe("");
            });

            describe("Loading checks", () => {
                beforeEach(() => store.dispatch(commentsLoading(commentKey)));

                it("state", () => {
                    expect(commentsAreLoading(store.getState(), publicationId, pageId)).toBeTruthy();
                });

                it("that success puts loading state back to false", () => {
                    store.dispatch(commentsLoaded(commentKey, []));
                    expect(commentsAreLoading(store.getState(), publicationId, pageId)).toBeFalsy();
                });

                it("that error puts loading state back to false", () => {
                    const error = { message: "Load Error"};
                    store.dispatch(commentsError(commentKey, error));
                    expect(commentsAreLoading(store.getState(), publicationId, pageId)).toBeFalsy();
                    expect(getCommentErrorMessage(store.getState(), publicationId, pageId)).toBe(error.message);
                });
            });

            describe("Saving checks", () => {
                const parentId = 42;
                const postCommentKey = getCommentsKey(publicationId, pageId, parentId);

                beforeEach(() => store.dispatch(commentSaving(postCommentKey)));

                it("state", () => {
                    expect(commentIsSaving(store.getState(), publicationId, pageId, parentId)).toBeTruthy();
                });

                it("that success puts saving state back to false", () => {
                    store.dispatch(commentSaved(postCommentKey, {} as IComment));
                    expect(commentIsSaving(store.getState(), publicationId, pageId, parentId)).toBeFalsy();
                });

                it("that error puts loading state back to false", () => {
                    const error = { message: "Save Error" };
                    store.dispatch(commentError(postCommentKey, error));
                    expect(commentIsSaving(store.getState(), publicationId, pageId, parentId)).toBeFalsy();
                    expect(getPostCommentErrorMessage(store.getState(), publicationId, pageId, parentId)).toBe(error.message);
                });
            });
        });
    }
}

new CommentsReducer().runTests();
