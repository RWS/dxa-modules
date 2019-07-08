package com.sdl.dxa.modules.ish.providers;

import com.sdl.web.model.componentpresentation.ComponentPresentationImpl;
import com.tridion.dcp.ComponentPresentation;
import com.tridion.dynamiccontent.ComponentPresentationAssembler;
import org.apache.commons.lang3.StringUtils;
import org.dd4t.core.exceptions.ItemNotFoundException;
import org.dd4t.core.exceptions.SerializationException;
import org.dd4t.providers.AbstractComponentPresentationProvider;
import org.dd4t.providers.ComponentPresentationProvider;
import org.dd4t.providers.ComponentPresentationResultItem;
import org.dd4t.providers.ComponentPresentationResultItemImpl;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * IshBrokerComponentPresentationProvider overrides behavior of DD4T's BrokerComponentPresentationProvider in
 * order to retrieve dynamic content.
 */
public class IshBrokerComponentPresentationProvider extends AbstractComponentPresentationProvider implements
        ComponentPresentationProvider {
    private static final Map<Integer, ComponentPresentationAssembler> ASSEMBLER_CACHE = new ConcurrentHashMap<>();

    @Override
    public String getDynamicComponentPresentation(int componentId, int publicationId)
            throws SerializationException, ItemNotFoundException {
        return getDynamicComponentPresentation(componentId, 0, publicationId);
    }

    @Override
    public String getDynamicComponentPresentation(int componentId, int templateId, int publicationId)
            throws ItemNotFoundException, SerializationException {

        ComponentPresentation result = getComponentPresentation(componentId, templateId, publicationId);
        String resultString = result.getContent();

        if (!StringUtils.isEmpty(resultString)) {
            return decodeAndDecompressContent(resultString);
        }
        return null;
    }

    @Override
    public ComponentPresentationResultItem<String> getDynamicComponentPresentationItem(int componentId, int
            publicationId) throws ItemNotFoundException, SerializationException {
        return getDynamicComponentPresentationItem(componentId, 0, publicationId);
    }

    @Override
    public ComponentPresentationResultItem<String> getDynamicComponentPresentationItem(int componentId, int
            templateId, int publicationId) throws ItemNotFoundException, SerializationException {

        ComponentPresentation result = getComponentPresentation(componentId, templateId, publicationId);
        ComponentPresentationResultItemImpl resultModel =
                new ComponentPresentationResultItemImpl(result.getPublicationId(), result.getComponentId(),
                        result.getComponentTemplateId());

        String resultString = result.getContent();

        if (!StringUtils.isEmpty(resultString)) {
            resultModel.setContentSource(decodeAndDecompressContent(resultString));
        } else {
            resultModel.setContentSource(resultString);
        }

        return resultModel;
    }

    protected ComponentPresentation getComponentPresentation(final int componentId, final int templateId, final int
            publicationId) throws ItemNotFoundException {
        ComponentPresentationAssembler assembler = new ComponentPresentationAssembler(publicationId);
        ComponentPresentationAssembler storedAssembler = ASSEMBLER_CACHE.putIfAbsent(publicationId, assembler);

        if (storedAssembler != null) {
            assembler = storedAssembler;
        }

        final int ishNamespace = 1;
        String content = assembler.getContent(componentId, templateId);
        assertQueryResultNotNull(content, componentId, templateId, publicationId);
        return new ComponentPresentationImpl(ishNamespace, publicationId, componentId, templateId, content);
    }
}

