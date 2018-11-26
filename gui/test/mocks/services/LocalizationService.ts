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

import { ILocalizationService, ILanguage } from "services/interfaces/LocalizationService";

export class LocalizationService implements ILocalizationService {
    public formatMessage(path: string, variables?: string[]): string {
        const message = `mock-${path}`;
        if (Array.isArray(variables)) {
            return message + variables.join("-");
        }
        return message;
    }

    public getLanguages(): ILanguage[] {
        return [
            { name: "English", iso: "en" },
            { name: "Nederlands", iso: "nl" }
        ];
    }

    /**
     *
     * @param {string} lang
     * @returns {("rtl" | "ltr")}
     *
     * @memberOf LocalizationService
     */
    public getDirection(lang: string): "rtl" | "ltr" {
        return ["ar", "dv", "fa", "he", "iw", "ps", "ur",
                "ar-ae", "ar-bh", "ar-dz", "ar-eg", "ar-iq", "ar-jo", "ar-kw", "ar-lb",
                "ar-ly", "ar-ma", "ar-om", "ar-qa", "ar-sa", "ar-sy", "ar-tn", "ar-ye",
                "dv-mv", "fa-ir", "he-il", "ps-ar", "ur-pk"].some((val: string) => val === lang) ? "rtl" : "ltr";
    }

    public getLanguage(): string {
        return "en";
    }

    public isoToName(iso: string): string {
        const options = [
            {"name": "English", "iso": "en"},
            {"name": "Nederlands", "iso": "nl"},
            {"name": "Deutsch", "iso": "de"},
            {"name": "עברית", "iso": "he"},
            {"name": "日本語", "iso": "ja"},
            {"name": "中文", "iso": "zh"}
        ].filter((language: ILanguage) => language.iso == iso);
        return options[0] && options[0].name || iso;
    }
}

export let localization = new LocalizationService();
