package com.demandware.api;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;

import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;

/**
 * JsonObjectMapperProvider
 *
 * @author nic
 */
@Provider
public class JsonObjectMapperProvider implements ContextResolver<ObjectMapper>
{
    @Override
    public ObjectMapper getContext(Class<?> type)
    {
        final ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return mapper;
    }
}
