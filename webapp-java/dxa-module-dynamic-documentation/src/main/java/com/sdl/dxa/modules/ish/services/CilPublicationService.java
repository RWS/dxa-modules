package com.sdl.dxa.modules.ish.services;


import com.sdl.dxa.modules.ish.model.Publication;
import com.sdl.dxa.modules.ish.exception.IshServiceException;
import com.sdl.dxa.modules.ish.services.PublicationService;
import com.sdl.web.api.meta.WebPublicationMetaFactory;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.controller.exception.NotFoundException;
import com.tridion.broker.StorageException;
import com.tridion.meta.CustomMeta;
import com.tridion.meta.NameValuePair;
import com.tridion.meta.PublicationMeta;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

/**
 * The service which provides list of publications.
 */
@Service
@Slf4j
@Profile("cil.providers.active")
@Deprecated
public class CilPublicationService implements PublicationService {

    private static final String PUBLICATION_TITLE_META = "publicationtitle.generated.value";
    private static final String PUBLICATION_PRODUCTFAMILYNAME_META = "FISHPRODUCTFAMILYNAME.logical.value";
    private static final String PUBLICATION_PRODUCTRELEASENAME_META = "FISHPRODUCTRELEASENAME.version.value";
    private static final String PUBLICATION_VERSIONREF_META = "ishversionref.object.id";
    private static final String PUBLICATION_LANG_META = "FISHPUBLNGCOMBINATION.lng.value";
    private static final String PUBLICATION_ONLINE_STATUS_META = "FISHDITADLVRREMOTESTATUS.lng.element";
    private static final String PUBLICATION_ONLINE_VALUE = "VDITADLVRREMOTESTATUSONLINE";
    private static final String PUBLICATION_CRATEDON_META = "CREATED-ON.version.value";
    private static final String PUBLICATION_VERSION_META = "VERSION.version.value";
    private static final String PUBLICATION_LOGICAL_ID = "ishref.object.value";

    @Autowired
    private WebPublicationMetaFactory webPublicationMetaFactory;

    @Override
    @Cacheable(value = "ish", key = "{ #localization.id }", condition = "#localization != null && #localization.id != null")
    public List<Publication> getPublicationList(Localization localization) {
        List<Publication> result = new ArrayList<>();
        try {
            PublicationMeta[] publicationMetas = webPublicationMetaFactory
                    .getAllMeta(Arrays.asList(PUBLICATION_TITLE_META, PUBLICATION_PRODUCTFAMILYNAME_META,
                            PUBLICATION_PRODUCTRELEASENAME_META, PUBLICATION_VERSIONREF_META,
                            PUBLICATION_LANG_META, PUBLICATION_ONLINE_STATUS_META,
                            PUBLICATION_CRATEDON_META, PUBLICATION_VERSION_META, PUBLICATION_LOGICAL_ID));

            for (PublicationMeta meta : publicationMetas) {
                if (isPublicationOnline(meta)) {
                    result.add(buildPublicationFrom(meta));
                }
            }
            return result;
        } catch (StorageException e) {
            throw new IshServiceException("Unable to fetch list of publications.", e);
        }
    }

    @Cacheable(value = "ish", key = "{ #localization.id }", condition = "#localization != null && #localization.id != null")
    public void checkPublicationOnline(int publicationId, Localization localization) {
        PublicationMeta publicationMeta = null;
        try {
            publicationMeta = webPublicationMetaFactory.getMeta(publicationId);
        } catch (StorageException e) {
            log.error("Couldn't find publication metadata for id: " + publicationId, e);
        }
        if (publicationMeta == null || !isPublicationOnline(publicationMeta)) {
            throw new NotFoundException("Unable to find publication " + publicationId);
        }
    }

    boolean isPublicationOnline(PublicationMeta publicationMeta) {
        CustomMeta customMeta = publicationMeta.getCustomMeta();
        return customMeta != null && PUBLICATION_ONLINE_VALUE.equals(
                customMeta.getFirstValue(PUBLICATION_ONLINE_STATUS_META)
        );
    }

    private Publication buildPublicationFrom(PublicationMeta publicationMeta) {
        Publication publication = new Publication();
        publication.setId(String.valueOf(publicationMeta.getId()));
        CustomMeta customMeta = publicationMeta.getCustomMeta();
        if (customMeta != null) {
            if (customMeta.getFirstValue(PUBLICATION_TITLE_META) != null) {
                // Take the generated title from the metadata
                // Equals to the root map title
                publication.setTitle((String) customMeta.getFirstValue(PUBLICATION_TITLE_META));
            } else {
                log.warn("Unable to find " + PUBLICATION_TITLE_META + " metadata field for publication = {}",
                        publicationMeta.getId());
                publication.setTitle(publicationMeta.getTitle());
            }

            if (customMeta.getFirstValue(PUBLICATION_PRODUCTFAMILYNAME_META) != null) {
                // Take the generated product family name from the metadata
                NameValuePair pair = customMeta.getNameValues().get(PUBLICATION_PRODUCTFAMILYNAME_META);
                List<Object> values = pair.getMultipleValues();
                List<String> productFamilies = new ArrayList<>();
                for (Object value: values) {
                    productFamilies.add(Objects.toString(value, null));
                }
                publication.setProductFamily(productFamilies);
            }

            if (customMeta.getFirstValue(PUBLICATION_PRODUCTRELEASENAME_META) != null) {
                // Take the generated product release name from the metadata
                NameValuePair pair = customMeta.getNameValues().get(PUBLICATION_PRODUCTRELEASENAME_META);
                List<Object> values = pair.getMultipleValues();
                List<String> productReleases = new ArrayList<>();
                for (Object value: values) {
                    productReleases.add(Objects.toString(value, null));
                }
                publication.setProductReleaseVersion(productReleases);
            }

            if (customMeta.getFirstValue(PUBLICATION_VERSIONREF_META) != null) {
                // Take the product family version
                String versionRef = String.valueOf(customMeta.getFirstValue(PUBLICATION_VERSIONREF_META));
                // The value is stored as float on Content Service, so we need to get rid of fractional part
                publication.setVersionRef(versionRef.split("[.]")[0]);
            }

            if (customMeta.getFirstValue(PUBLICATION_LANG_META) != null) {
                // Take the publication language
                publication.setLanguage(String.valueOf(customMeta.getFirstValue(PUBLICATION_LANG_META)));
            }

            if (customMeta.getFirstValue(PUBLICATION_CRATEDON_META) != null) {
                publication.setCreatedOn(String.valueOf(customMeta.getFirstValue(PUBLICATION_CRATEDON_META)));
            }

            if (customMeta.getFirstValue(PUBLICATION_VERSION_META) != null) {
                publication.setVersion(String.valueOf(customMeta.getFirstValue(PUBLICATION_VERSION_META)));
            }

            if (customMeta.getFirstValue(PUBLICATION_LOGICAL_ID) != null) {
                publication.setLogicalId(String.valueOf(customMeta.getFirstValue(PUBLICATION_LOGICAL_ID)));
            }
        }
        return publication;
    }

}
