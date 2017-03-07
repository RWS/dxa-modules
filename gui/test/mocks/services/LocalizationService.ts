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
}

export let localization = new LocalizationService();
