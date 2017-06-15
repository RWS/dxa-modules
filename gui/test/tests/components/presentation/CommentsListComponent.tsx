import * as React from "react";
import * as ReactDOM from "react-dom";
import { ICommentsListProps, CommentsListPresentation } from "@sdl/dd/CommentsList/CommentsListPresentation";
import { IComment, IUser } from "interfaces/Comments";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "@sdl/models";

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
            const comments: IComment[] = [{
                id: 1,
                namespaceId: 1,
                itemPublicationId: 1,
                itemId: 1,
                itemType: 1,
                score: 0,
                status: 0,
                creationDate: "14.06.2017",
                lastModifiedDate: "15.06.2017",
                content: "Test comment",
                moderator: "",
                moderatedDate: "15.06.2017",
                parentId: 0,
                parent: {} as IComment,
                children: [],
                user: user,
                idLong: 0
            } as IComment];

            it("Correct component render", (): void => {
                const commentsList = this._renderComponent({comments}, target);
                const commentsListNode = ReactDOM.findDOMNode(commentsList);
                const title = commentsListNode.querySelector(".sdl-dita-delivery-comments-list > span");
                const renderedComments = commentsListNode.querySelectorAll(".sdl-dita-delivery-comment");

                expect(commentsList).not.toBeNull;
                title ? expect(title.textContent).toBe(`mock-components.commentslist.comments (${comments.length})`) : expect(title).not.toBeNull();
                expect(renderedComments.length).toBe(1);
            });

        });
    }

    private _renderComponent(props: ICommentsListProps, target: HTMLElement): ComponentWithContext {
        return ReactDOM.render(<ComponentWithContext><CommentsListPresentation {...props} /></ComponentWithContext>, target) as ComponentWithContext;
    }
}

new CommentsListComponent().runTests();
