import * as React from "react";
import * as ReactDOM from "react-dom";
import { ICommentsListProps, CommentsListPresentation } from "@sdl/dd/CommentsList/CommentsListPresentation";
import { IComment, IUser, ICommentDate } from "interfaces/Comments";
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
            const totalComments = 7;
            const createComment = (): IComment => {
                return {
                    id: parseInt(`${Math.random() * 1000}`),
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
                    moderatedDate: "15.06.2017",
                    parentId: 0,
                    parent: {} as IComment,
                    children: [],
                    user: user,
                    idLong: 0
                } as IComment;
            }

            const comments: IComment[] = [];
            for (let i = 0; i < totalComments; i++) {
                comments.push(createComment());
            }

            it("Correct component render", (): void => {
                const commentsList = this._renderComponent({comments}, target);
                const commentsListNode = ReactDOM.findDOMNode(commentsList);
                const title = commentsListNode.querySelector(".sdl-dita-delivery-comments-list > span");
                const renderedComments = commentsListNode.querySelectorAll(".sdl-dita-delivery-comment");
                const loadMoreButton = commentsListNode.querySelector(".sdl-dita-delivery-comments-list-more > button") as HTMLButtonElement;

                expect(commentsList).not.toBeNull();
                expect(loadMoreButton).not.toBeNull();
                title ? expect(title.textContent).toBe(`mock-components.commentslist.comments${comments.length}`) : expect(title).not.toBeNull();
                expect(renderedComments.length).toBe(5);
            });

            it("Load more clicked", (): void => {
                const commentsList = this._renderComponent({comments}, target);
                const commentsListNode = ReactDOM.findDOMNode(commentsList);
                let loadMoreButton = commentsListNode.querySelector(".sdl-dita-delivery-comments-list-more > button") as HTMLButtonElement;
                expect(loadMoreButton).not.toBeNull();

                loadMoreButton.click();

                const renderedComments = commentsListNode.querySelectorAll(".sdl-dita-delivery-comment");
                expect(renderedComments.length).toBe(7);

                loadMoreButton = commentsListNode.querySelector(".sdl-dita-delivery-comments-list-more > button") as HTMLButtonElement;
                expect(loadMoreButton).toBeNull();
            });

        });
    }

    private _renderComponent(props: ICommentsListProps, target: HTMLElement): ComponentWithContext {
        return ReactDOM.render(<ComponentWithContext><CommentsListPresentation {...props} /></ComponentWithContext>, target) as ComponentWithContext;
    }
}

new CommentsListComponent().runTests();
