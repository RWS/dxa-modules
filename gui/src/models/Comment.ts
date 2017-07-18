import { Api, API_REQUEST_TYPE_JSON } from "utils/Api";
import { Net, IWebRequest, LoadableObject } from "@sdl/models";
import { IPostComment } from "interfaces/Comments";
import { IComment } from "interfaces/ServerModels";

export class Comment extends LoadableObject {
    private _comment: IPostComment;
    private _result: IComment;

    constructor(comment: IPostComment) {
        super();
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

    public getComment(): IComment {
        return this._result;
    };

    public save(): void {
        if (this.validate()) {
            this._setLoading();
            this._executeLoad();
        }
    };

    /* Overloads */
    protected _executeLoad(): void {
        const url = Api.getSaveCommentUrl();
        const body = JSON.stringify(this._comment);
        Net.postRequest(url, body, API_REQUEST_TYPE_JSON,
            this.getDelegate(this._onLoad),
            this.getDelegate(this._onLoadFailed));
    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        this._result = JSON.parse(result);
        super._processLoadResult(result, webRequest);
    }
}
