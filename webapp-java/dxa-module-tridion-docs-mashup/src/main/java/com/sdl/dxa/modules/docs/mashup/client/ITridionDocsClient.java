package com.sdl.dxa.modules.docs.mashup.client;

import com.sdl.dxa.modules.docs.mashup.models.widgets.Topic;
import com.sdl.web.pca.client.exceptions.GraphQLClientException;
import com.sdl.webapp.common.api.model.KeywordModel;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 *
 * This is a wrapper around the actual Tridion docs client like PublicContentApi or GraphQLClient client  
 * and tries to isolate the related logic and codes for 
 * creating the required filters ,
 * performing the query , 
 * processing and converting the returned results
 */
public interface ITridionDocsClient  {
    
      /**
     * Returns a collection of Tridion docs topics based on the provided keywords using GraphQLClient
     * 
     * @param keywords a collection of keywords to filter the topics
     * @param maxItems maximum number of topics to be displayed
     * @throws com.sdl.web.pca.client.exceptions.GraphQLClientException
     * @throws java.io.IOException
     */
    
    List<Topic> getTopics(Map<String, KeywordModel> keywords, int maxItems) throws GraphQLClientException, IOException;
    
}
