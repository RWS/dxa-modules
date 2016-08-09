/// <reference path="../../typings/index.d.ts"/>

module SDL.Client.Configuration {
    /**
     * Location of your main configuration file.
     * Needed by the TestLoader inside Catalina.
     * This way it knows where to find your test configuration file.
     */
    settingsFile = "/test/configuration.xml";
}
module SDL.Client.Test.Configuration {
    /**
     * Resource group inside your configuration file.
     * TestLoader will load this one into the browser and execute your tests.
     */
    testResourceGroup = "Sdl.KcWebApp.Test";
}
