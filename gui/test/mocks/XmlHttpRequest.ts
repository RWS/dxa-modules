/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

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
