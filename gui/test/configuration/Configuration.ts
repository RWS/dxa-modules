import { IWindow } from "interfaces/Window";

const globalWindow = (window as IWindow);

// Enable mocks
globalWindow.SdlDitaDeliveryMocksEnabled = false;
