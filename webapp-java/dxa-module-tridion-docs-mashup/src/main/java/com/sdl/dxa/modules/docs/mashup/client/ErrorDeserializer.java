package com.sdl.dxa.modules.docs.mashup.client;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import java.io.IOException;

/**
 *
 * This class is to deserialize the error inside returned json from
 * GraphQLClient
 */
public class ErrorDeserializer extends StdDeserializer<Error> {

    public ErrorDeserializer() {
        this(null);
    }

    public ErrorDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public Error deserialize(JsonParser jp, DeserializationContext ctxt)
            throws IOException, JsonProcessingException {

        JsonNode edges = jp.getCodec().readTree(jp);

        if (edges != null && edges.findValue("errors") != null) {

            return new UnknownError(edges.findValue("errorType") + " : " + edges.findValue("message"));
        }

        return null;
    }
}
