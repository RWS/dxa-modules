import { IWindow } from "interfaces/Window";

const globalWindow = (window as IWindow);

// Enable mocks
globalWindow.SdlDitaDeliveryMocksEnabled = false;
globalWindow.SdlDitaDeliveryCommentingIsEnabled = true;
globalWindow.SdlDitaDeliveryContentIsEvaluable = false;