/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../src/global/client/RoutingClient.ts" />

module Sdl.DitaDelivery.Tests.Mocks {

    export class Routing extends RoutingClient {

        constructor() {
            super("/", true);
        }
    }

}
