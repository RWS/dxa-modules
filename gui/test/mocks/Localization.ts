/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../src/interfaces/Localization.d.ts" />

module Sdl.DitaDelivery.Tests.Mocks {

    export class Localization implements ILocalization {

        public formatMessage(path: string, variables?: string[]): string {
            const message = `mock-${path}`;
            if (Array.isArray(variables)) {
                return message + variables.join("-");
            }
            return message;
        }
    }

}
