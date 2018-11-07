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

/**
 * Maximum characters for a string
 */
const STR_MAX_CHARS = 250;

/**
 * Truncate ending
 */
const TRUNCATE_ENDING = "...";

/**
 * String helper methods
 *
 * @export
 * @class String
 */
export class String {

    /**
     * Truncates string with number of chars
     *
     * @static
     * @param {string} str String to truncate
     * @param {number} atChar Chars count to truncate to
     * @param {string} string truncate ending string
     * @returns { string }
     *
     * @memberOf String
     */
    public static truncate(str: string, atChar: number = STR_MAX_CHARS, ending: string = TRUNCATE_ENDING): string {
        if (str.length > atChar) {
            str = str.substr(0, atChar);
            atChar = str.lastIndexOf(" ");
            str = ((atChar > 0) ? str.substr(0, atChar) : str) + ending;
        }
        return str;
    }

    /**
     * Trim and normalize string to lowercase
     *
     * @static
     * @param {string} str String to modify
     * @returns {string}
     *
     * @memberOf String
     */
    public static normalize(str: string): string {
        return str.toLowerCase().trim();
    }
}
