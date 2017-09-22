import * as React from "react";
import * as ReactDOM from "react-dom";
import { ICommentProps, Comment } from "@sdl/dd/Comment/Comment";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "@sdl/models";

class CommentComponent extends TestBase {

    public runTests(): void {

        describe(`Comment component tests.`, (): void => {
            const target = super.createTargetElement();
            const commentTestData = {
                userName: "tester",
                creationDate: "15.06.2017",
                content: "Test comment"
            };

            it("renders comment", (): void => {
                const commentComponent = this._renderComponent(commentTestData, target);
                const commentNode = ReactDOM.findDOMNode(commentComponent);
                const name = commentNode.querySelector(".sdl-dita-delivery-comment-username");
                const date = commentNode.querySelector(".sdl-dita-delivery-comment-date");
                const comment = commentNode.querySelector(".sdl-dita-delivery-comment-content");

                expect(commentComponent).not.toBeNull;
                expect(name && name.textContent).toBe(commentTestData.userName);
                expect(date && date.textContent).toBe(commentTestData.creationDate);
                expect(comment && comment.textContent).toBe(commentTestData.content);
            });

            it("renders comment with children", (): void => {
                const testClassName = "test-child";
                const commentComponent = this._renderComponent({...commentTestData, children : <div id={testClassName} />}, target);
                const commentNode = ReactDOM.findDOMNode(commentComponent);
                expect(commentNode.querySelector(`.${testClassName}`)).not.toBeNull;
            });

        });
    }

    private _renderComponent(props: ICommentProps, target: HTMLElement): ComponentWithContext {
        return ReactDOM.render(<ComponentWithContext><Comment {...props} /></ComponentWithContext>, target) as ComponentWithContext;
    }
}

new CommentComponent().runTests();
