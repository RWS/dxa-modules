import { ILocalizationService } from "services/interfaces/LocalizationService";

export class LocalizationService implements ILocalizationService {

    /**
     *
     * @type {string[]}
     * @memberOf LocalizationService
     */
    public rtlLanguages: string[] = ["ar", "he", "ur", "fa", "iw"];

    public formatMessage(path: string, variables?: string[]): string {
        const message = `mock-${path}`;
        if (Array.isArray(variables)) {
            return message + variables.join("-");
        }
        return message;
    }

    /**
     *
     * @param {string} lang
     * @returns {("rtl" | "ltr")}
     *
     * @memberOf LocalizationService
     */
    public getDirection(lang: string): "rtl" | "ltr" {
        return this.rtlLanguages.some((val: string) => val === lang) ? "rtl" : "ltr";
    }
}

export let localization = new LocalizationService();
