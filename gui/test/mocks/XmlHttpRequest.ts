import { ASYNC_DELAY } from "test/Constants";

export class FakeXMLHttpRequest {
    public readyState: number = 0;
    public status: number = 500;
    public statusText: string = "";
    public onreadystatechange: () => void;
    public responseText: string;

    public open = (): void => { };
    public send = (): void => { };
    public getResponseHeader = (): void => { };
    public setRequestHeader = (): void => { };

    constructor(statusText: string) {
        this.statusText = statusText;
        setTimeout((): void => {
            this.readyState = 4;
            if (typeof this.onreadystatechange === "function") {
                this.onreadystatechange();
            }
        }, ASYNC_DELAY);
    }
}
