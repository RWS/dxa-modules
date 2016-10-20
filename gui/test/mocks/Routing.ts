import { RoutingClient } from "../../src/global/client/RoutingClient";

export class Routing extends RoutingClient {

    constructor() {
        super("/", true);
    }
}

export let routing = new Routing();
