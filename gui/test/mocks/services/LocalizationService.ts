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
        return ["ar", "dv", "fa", "he", "iw", "ps", "ur", "ar-ae", "ar-bh", "ar-dz", "ar-eg", "ar-iq", "ar-jo", "ar-kw", "ar-lb", "ar-ly", "ar-ma", "ar-om", "ar-qa", "ar-sa", "ar-sy", "ar-tn", "ar-ye", "dv-mv", "fa-ir", "he-il", "ps-ar", "ur-pk"].some((val: string) => val === lang) ? "rtl" : "ltr";
    }

    public getLanguage(): string {
        return "en";
    }
}

export let localization = new LocalizationService();
