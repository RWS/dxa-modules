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

import { PublicationService } from "services/server/PublicationService";
import { TestBase } from "@sdl/models";

class PublicationServiceTests extends TestBase {

    public runTests(): void {
        const publicationService = new PublicationService();

        describe(`Data Store tests (Publications).`, (): void => {

            it("can get a publication by id", (done: () => void): void => {
                const publicationId = "ish:39137-1-1";
                publicationService.getPublicationById(publicationId).then(pub => {
                    expect(pub && pub.title).toBe("MP330");
                    done();
                }).catch(error => {
                    fail(`Unexpected error: ${error}`);
                    done();
                });
            });
        });
    }
}

new PublicationServiceTests().runTests();
