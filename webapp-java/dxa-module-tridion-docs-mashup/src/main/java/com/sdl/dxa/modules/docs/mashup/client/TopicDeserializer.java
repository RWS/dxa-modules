package com.sdl.dxa.modules.docs.mashup.client;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.sdl.dxa.modules.docs.mashup.models.widgets.Topic;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.net.URI;

/**
 *
 * This class is to deserialize the returned json from GraphQLClient It tried to
 * extract Topic related values from the result and returns a collection of
 * Topics
 */
public class TopicDeserializer extends StdDeserializer<List<Topic>> {

    private String _prefixForTopicsUrl;
    private String _prefixForBinariesUrl;

    public TopicDeserializer() {
        this(null);
    }

    public TopicDeserializer(Class<?> vc) {
        super(vc);
    }

    TopicDeserializer(String prefixForTopicsUrl, String prefixForBinariesUrl) {
        this(null);
        this._prefixForTopicsUrl = prefixForTopicsUrl;
        this._prefixForBinariesUrl = prefixForBinariesUrl;
    }

    @Override
    public List<Topic> deserialize(JsonParser jp, DeserializationContext ctxt)
            throws IOException, JsonProcessingException {

        List<Topic> topics = new ArrayList<Topic>();

        JsonNode edges = jp.getCodec().readTree(jp);

        if (edges != null) {
            edges.findValue("edges").forEach((edge) -> {

                Topic topic = new Topic();
                String id = edge.findValue("containerItems").findValue("Component").get("Id").asText();
                String title = edge.findValue("containerItems").findValue("topicTitle").get("Values").path(0).asText();
                String link = getLink(edge.findValue("url").asText(), _prefixForTopicsUrl);

                String body = edge.findValue("containerItems").findValue("topicBody").get("Values").path(0).asText();

                topic.setId(id);
                topic.setTitle(title);
                topic.setLink(link);
                topic.setBody(body);

                topics.add(topic);

            });
        }

        return topics;
    }

    public String getLink(String uri, String prefixForTopicsUrl) {

        if (uri != null && !uri.isEmpty()) {
            URI topicUri = URI.create(uri);

            if (topicUri.isAbsolute()) {
                uri = topicUri.toString();
            } else {

                if ((topicUri.getHost() == null || topicUri.getHost().isEmpty()) && !uri.startsWith("/")) {
                    uri = "/" + uri;
                }

                topicUri = URI.create(prefixForTopicsUrl + uri);
                
                if (topicUri.isAbsolute()) {
                    uri = topicUri.toString();
                }
            }
        }

        return uri;
    }
}
