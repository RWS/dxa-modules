package com.sdl.dxa.modules.ish.services;

import com.sdl.dxa.tridion.modelservice.ModelServiceClient;
import com.sdl.dxa.tridion.modelservice.ModelServiceClientConfiguration;
import com.tridion.ambientdata.claimstore.ClaimStore;
import com.tridion.ambientdata.web.WebContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.util.Base64;
import java.util.Map;

@Service
@Qualifier("ishModuleServiceClient")
@Profile("cil.providers.active")
public class IshModuleServiceClient extends ModelServiceClient  {

    @Autowired
    public IshModuleServiceClient(ModelServiceClientConfiguration configuration) {
        super(configuration);
    }

    /** This merthod provides special claim to ModelService to support user conditions.
      * @param headers Http Headers to be extended in particular module
     */
    @Override
    protected void processModuleSpecificCookies(HttpHeaders headers) {
        ClaimStore claimStore = WebContext.getCurrentClaimStore();
        if (claimStore == null) return;
        for (Map.Entry<URI, Object> entry : claimStore.getAll().entrySet()) {
            String key = entry.getKey().toString();
            if (!key.startsWith("taf:ish:")) continue;
            try {
                byte[] bytes = entry.getValue().toString().getBytes("UTF-8");
                String value = Base64.getEncoder().encodeToString(bytes);
                headers.add(HttpHeaders.COOKIE, String.format("%s=%s", key.replace(":", "."), value));
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException("UTF-8 encoder is not found. " +
                        "This should be impossible. Are you using JVM?", e);
            }
        }
    }
}
