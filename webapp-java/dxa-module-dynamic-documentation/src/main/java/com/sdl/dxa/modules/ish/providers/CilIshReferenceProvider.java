package com.sdl.dxa.modules.ish.providers;

import com.google.common.base.Joiner;
import com.sdl.web.api.broker.querying.QueryImpl;
import com.sdl.web.api.broker.querying.criteria.Criteria;
import com.sdl.web.api.broker.querying.criteria.content.ItemLastPublishedDateCriteria;
import com.sdl.web.api.broker.querying.criteria.content.ItemTypeCriteria;
import com.sdl.web.api.broker.querying.criteria.content.PublicationCriteria;
import com.sdl.web.api.broker.querying.criteria.metadata.CustomMetaKeyCriteria;
import com.sdl.web.api.broker.querying.criteria.metadata.CustomMetaValueCriteria;
import com.sdl.web.api.broker.querying.criteria.operators.AndCriteria;
import com.sdl.web.model.ItemImpl;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.tridion.ItemTypes;
import com.tridion.broker.StorageException;
import com.tridion.broker.querying.criteria.CriteriaException;
import com.tridion.meta.Item;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import static com.sdl.web.api.broker.querying.criteria.FieldOperator.GREATER_OR_EQUAL_THAN;


/**
 * Provider to fetch meta information.
 */
@Component
@Slf4j
@Profile("cil.providers.active")
@Deprecated
public class CilIshReferenceProvider implements IshReferenceProvider {
    /**
     * Meta field name which is common for every publication which contains a topic.
     */
    private static final String DEFAULT_PUBLISH_DATA = "1900-01-01 00:00:00.000";

    public Item getPageIdByIshLogicalReference(Integer publicationId, String ishLogicalRefValue)
            throws ContentProviderException {
        try {
            QueryImpl query = createQuery(createCriteria(publicationId, ishLogicalRefValue));
            Item[] items = query.executeEntityQuery();
            if (items == null) {
                throw new ContentProviderException("Error has been found " +
                        "in publication " + publicationId +
                        " with logical ref value " + ishLogicalRefValue + ", which produces null as result");
            }
            if (items.length == 0) {
                return new ItemImpl() {
                    // default empty
                };
            }
            if (items.length > 1) {
                throw new ContentProviderException("There are [" + Joiner.on(",").join(items) +
                        "] PageIds found in publication " + publicationId +
                        " with logical ref value " + ishLogicalRefValue + " but it's supposed to be only one");
            }
            //valid result looks like 'tcm:1420746-164331-64'
            return items[0];
        } catch (StorageException | CriteriaException ex) {
            throw new ContentProviderException("Page reference by ishlogicalref.object.id = [" + ishLogicalRefValue +
                    "] not found in publication: [" + publicationId + "]", ex);
        } catch (NumberFormatException ex) {
            throw new ContentProviderException("Page reference by ishlogicalref.object.id = [" + ishLogicalRefValue +
                    "] in publication: [" + publicationId + "] but it's not a number", ex);
        }
    }

    Criteria createCriteria(Integer publicationId, String ishLogicalRefValue) throws CriteriaException {
        Criteria dateCriteria = new ItemLastPublishedDateCriteria(DEFAULT_PUBLISH_DATA, GREATER_OR_EQUAL_THAN);
        CustomMetaKeyCriteria metaKeyCriteria = new CustomMetaKeyCriteria(REF_FIELD_NAME);
        Criteria refCriteria = new CustomMetaValueCriteria(metaKeyCriteria, ishLogicalRefValue);
        Criteria pubCriteria = new PublicationCriteria(publicationId);
        Criteria itemType = new ItemTypeCriteria(ItemTypes.PAGE);
        return new AndCriteria(dateCriteria, refCriteria, itemType, pubCriteria);
    }

    @NotNull
    QueryImpl createQuery(Criteria criteria) {
        return new QueryImpl(criteria);
    }
}
