module SDL.Client.Configuration {
    /**
     * Location of your main configuration file.
     * Needed by the TestLoader inside Catalina.
     * This way it knows where to find your test configuration file.
     */
    export var settingsFile = "/test/configuration.xml";
}
module SDL.Client.Test.Configuration {
    /**
     * Resource group inside your configuration file.
     * TestLoader will load this one into the browser and execute your tests.
     */
    export var testResourceGroup = "Sdl.DitaDelivery.Test";
}

// Update global scope so Catalina can pick up the settings
(<Window & { SDL: typeof SDL }>window).SDL = SDL;
