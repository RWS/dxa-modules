import { ILocalizationService } from "../../../src/services/interfaces/LocalizationService";

export class LocalizationService implements ILocalizationService {

    public formatMessage(path: string, variables?: string[]): string {
        const message = `mock-${path}`;
        if (Array.isArray(variables)) {
            return message + variables.join("-");
        }
        return message;
    }
}

export let localization = new LocalizationService();
