/// <reference path="../../typings/index.d.ts" />

import { IWindow } from "interfaces/Window";

const globalWindow = (window as IWindow);

// Enable mocks
globalWindow.SdlDitaDeliveryMocksEnabled = true;
