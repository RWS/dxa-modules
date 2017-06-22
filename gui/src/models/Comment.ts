import { Api } from "utils/Api";
import { Net, LoadableObject } from "@sdl/models";
import { IComment } from "interfaces/Comments";

export class Comment extends LoadableObject {
    private _publicationId: string;
    private _pageId: string;
    private _comment: IComment;

    constructor(publicationId: string, pageId: string, comment: IComment) {
        super();
        this._publicationId = publicationId;
        this._pageId = pageId;
        this._comment = comment;
    }

    public validate(): boolean {
        var e = this.fireEvent("validate");
        if (e && e.defaultPrevented) {
            this.fireEvent("validatefailed", e.data);
            return false;
        }
        else {
            return true;
        }
    };

    public save(): void {
        if (this.validate()) {
            this._setLoading();
            this._executeLoad();
        }
    };

    /* Overloads */

    protected _executeLoad(): void {
        const url = Api.getSaveCommentUrl(this._publicationId, this._pageId);
        const body = `conditions=${JSON.stringify(this._comment)}`;
        Net.postRequest(url, body, "application/json",
            this.getDelegate(this._onLoad),
            this.getDelegate(this._onLoadFailed));
    }
}
