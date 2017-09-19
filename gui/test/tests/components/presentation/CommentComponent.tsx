import * as React from "react";
import * as ReactDOM from "react-dom";
import { ICommentProps, Comment } from "@sdl/dd/Comment/Comment";
//import { IComment } from "interfaces/ServerModels";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "@sdl/models";

class CommentComponent extends TestBase {

    public runTests(): void {

        describe(`Comment component tests.`, (): void => {
            const target = super.createTargetElement();
            const userName: string = "tester";
            const creationDate: string = "15.06.2017";
            const content: string = "Test comment";
            //const replies: IComment[] = [];

            it("Correct component render", (): void => {
                const commentComponent = this._renderComponent({userName, creationDate, content/*, replies*/}, target);
                const commentNode = ReactDOM.findDOMNode(commentComponent);
                const name = commentNode.querySelector(".sdl-dita-delivery-comment-username");
                const date = commentNode.querySelector(".sdl-dita-delivery-comment-date");
                const comment = commentNode.querySelector(".sdl-dita-delivery-comment-content");

                expect(commentComponent).not.toBeNull;
                name ? expect(name.textContent).toBe("tester") : expect(name).not.toBeNull();
                date ? expect(date && date.textContent).toBe("15.06.2017") : expect(date).not.toBeNull();
                comment ? expect(comment && comment.textContent).toBe("Test comment") : expect(comment).not.toBeNull();
            });

        });
    }

    private _renderComponent(props: ICommentProps, target: HTMLElement): ComponentWithContext {
        return ReactDOM.render(<ComponentWithContext><Comment {...props} /></ComponentWithContext>, target) as ComponentWithContext;
    }
}

new CommentComponent().runTests();
