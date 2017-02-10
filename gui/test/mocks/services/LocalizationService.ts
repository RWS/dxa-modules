import { ILocalizationService } from "services/interfaces/LocalizationService";

export class LocalizationService implements ILocalizationService {

    public formatMessage(path: string, variables?: string[]): string {
        const message = `mock-${path}`;
        if (Array.isArray(variables)) {
            return message + variables.join("-");
        }
        return message;
    }

    public getDirection(): string {
        return "ltr";
    }
}

export let localization = new LocalizationService();
