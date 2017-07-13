import * as React from "react";
import * as ReactDOM from "react-dom";
import { CommentsSectionsPresentation, ICommentsSectionProps } from "@sdl/dd/CommentsSection/CommentsSectionPresentation";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "@sdl/models";
import { Provider } from "react-redux";
import { configureStore } from "store/Store";
import { Store } from "redux";
import { IState } from "store/interfaces/State";

class CommentsSectionComponent extends TestBase {

    public runTests(): void {

        describe(`CommentsSection component tests.`, (): void => {
            const target = super.createTargetElement();

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("Correct component render", (): void => {
                const commentsSection = this._renderComponent({publicationId: "1", pageId: "1", error: ""}, target);
                const commentsSectionNode = ReactDOM.findDOMNode(commentsSection);
                const commentsListNode = commentsSectionNode.querySelector(".sdl-dita-delivery-comments-list");
                const postCommentNode = commentsSectionNode.querySelector(".sdl-dita-delivery-postcomment");

                expect(commentsListNode).not.toBeNull();
                expect(postCommentNode).not.toBeNull();
            });

            it("Correct error render ", (): void => {
                const commentsSection = this._renderComponent({publicationId: "1", pageId: "1", error: "Error message"}, target);
                const commentsSectionNode = ReactDOM.findDOMNode(commentsSection);
                const commentsListNode = commentsSectionNode.querySelector(".sdl-dita-delivery-comments-list");
                const postCommentNode = commentsSectionNode.querySelector(".sdl-dita-delivery-postcomment");
                const errorNode = commentsSectionNode.querySelector(".sdl-dita-delivery-error") as HTMLElement;
                const errorButton = errorNode.querySelectorAll(".sdl-button") as NodeListOf<HTMLButtonElement>;

                expect(commentsListNode).toBeNull();
                expect(postCommentNode).toBeNull();
                expect(errorNode).not.toBeNull();
                expect(errorButton.length).toBe(1);
            });
        });
    }

    private _renderComponent(props: ICommentsSectionProps, target: HTMLElement): ComponentWithContext {
        const store: Store<IState> = configureStore();
        return ReactDOM.render(<ComponentWithContext>
                <Provider store={store}>
                    <CommentsSectionsPresentation {...props} />
                </Provider>
            </ComponentWithContext>, target) as ComponentWithContext;
    }
}

new CommentsSectionComponent().runTests();
