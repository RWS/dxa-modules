/// <reference path="../../typings/index.d.ts" />

import { IWindow } from "interfaces/Window";

/**
 * Location of your main configuration file.
 * Needed by the TestLoader inside Catalina.
 * This way it knows where to find your test configuration file.
 */
const settingsFile = "/test/configuration.xml";

/**
 * Resource group inside your configuration file.
 * TestLoader will load this one into the browser and execute your tests.
 */
const testResourceGroup = "Sdl.DitaDelivery.Test";

const globalWindow = (window as IWindow);

// Update global scope so Catalina can pick up the settings
globalWindow.SDL = globalWindow.SDL || {};
globalWindow.SDL.Client = globalWindow.SDL.Client || {};
globalWindow.SDL.Client.Configuration = globalWindow.SDL.Client.Configuration || {};
globalWindow.SDL.Client.Configuration.settingsFile = settingsFile;
globalWindow.SDL.Client.Test = globalWindow.SDL.Client.Test || {};
globalWindow.SDL.Client.Test.Configuration = globalWindow.SDL.Client.Test.Configuration || {};
globalWindow.SDL.Client.Test.Configuration.testResourceGroup = testResourceGroup;

// Enable mocks
globalWindow.SdlDitaDeliveryMocksEnabled = true;
