package com.sdl.dxa.modules.search.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.sdl.webapp.common.api.model.RichText;

import java.io.IOException;

public class FlatRichTextSerializer extends JsonSerializer<RichText> {
    @Override
    public void serialize(RichText value, JsonGenerator jgen, SerializerProvider provider) throws IOException {
        jgen.writeString(value.toString());
    }
}
