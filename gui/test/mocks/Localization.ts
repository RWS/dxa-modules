import { ILocalization } from "../../src/interfaces/Localization";

export class Localization implements ILocalization {

    public formatMessage(path: string, variables?: string[]): string {
        const message = `mock-${path}`;
        if (Array.isArray(variables)) {
            return message + variables.join("-");
        }
        return message;
    }
}

export let localization = new Localization();
