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
        return ["ar", "dv", "fa", "he", "iw", "ps", "ur"].some((val: string) => val === lang) ? "rtl" : "ltr";
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
