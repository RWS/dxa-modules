package com.sdl.dxa.modules.ish.providers;

import com.sdl.web.api.broker.querying.QueryImpl;
import com.sdl.web.api.broker.querying.criteria.BrokerCriteria;
import com.sdl.web.api.broker.querying.criteria.Criteria;
import com.sdl.web.api.broker.querying.criteria.content.ItemLastPublishedDateCriteria;
import com.sdl.web.api.broker.querying.criteria.content.ItemTypeCriteria;
import com.sdl.web.api.broker.querying.criteria.content.PublicationCriteria;
import com.sdl.web.api.broker.querying.criteria.metadata.CustomMetaValueCriteria;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.tridion.ItemTypes;
import com.tridion.broker.StorageException;
import com.tridion.broker.querying.MetadataType;
import com.tridion.meta.Item;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.List;

import static com.sdl.dxa.modules.ish.providers.IshReferenceProvider.REF_FIELD_NAME;
import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertNotNull;
import static org.mockito.Mockito.doCallRealMethod;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Provider which returns meta information for given publication.
 */
@RunWith(MockitoJUnitRunner.class)
public class CilIshReferenceProviderTest {
    private static final Integer PUB_ID = 10992;
    private static final String LOGICAL_REF_VALUE = "ishlogicalref.object.id.value";
    private static final long DATE_1990 = -2208996000000L;
    private static final int FIRST_CRITERIA_INDEX = 0;
    private static final int SECOND_CRITERIA_INDEX = 1;
    private static final int THIRD_CRITERIA_INDEX = 2;
    private static final int FORTH_CRITERIA_INDEX = 3;
    private static final int TOTAL_CRITERIAS = 4;

    @Mock
    private Item pageId;
    @Mock
    private Criteria anyCriteria = mock(Criteria.class);
    @Mock
    private QueryImpl query = mock(QueryImpl.class);
    @Spy
    private CilIshReferenceProvider provider;

    @Before
    public void setUp() throws Exception {
        doReturn(anyCriteria).when(provider).createCriteria(PUB_ID, LOGICAL_REF_VALUE);
        doReturn(query).when(provider).createQuery(anyCriteria);
        when(query.executeEntityQuery()).thenReturn(new Item[FIRST_CRITERIA_INDEX]);
    }

    @Test
    public void createCriteria() throws Exception {
        doCallRealMethod().when(provider).createCriteria(PUB_ID, LOGICAL_REF_VALUE);
        Criteria criteria = provider.createCriteria(PUB_ID, LOGICAL_REF_VALUE);

        List<BrokerCriteria> criterias = criteria.getCriteriaChildren();
        assertEquals(TOTAL_CRITERIAS, criterias.size());
        ItemLastPublishedDateCriteria criteria1 = (ItemLastPublishedDateCriteria) criterias.get(FIRST_CRITERIA_INDEX);
        Assert.assertNotNull(criteria1.getConvertedDate());
        CustomMetaValueCriteria criteria2 = (CustomMetaValueCriteria) criterias.get(SECOND_CRITERIA_INDEX);
        assertEquals(REF_FIELD_NAME, criteria2.getMetadataKey());
        assertEquals(LOGICAL_REF_VALUE, criteria2.getValue());
        assertEquals(MetadataType.STRING, criteria2.getMetaDataType());
        ItemTypeCriteria criteria3 = (ItemTypeCriteria) criterias.get(THIRD_CRITERIA_INDEX);
        assertEquals(ItemTypes.PAGE, (int) criteria3.getItemType());
        PublicationCriteria criteria4 = (PublicationCriteria) criterias.get(FORTH_CRITERIA_INDEX);
        assertEquals(PUB_ID, criteria4.getPublicationId());
    }

    @Test
    public void createQuery() {
        assertNotNull(provider.createQuery(anyCriteria));
    }

    @Test
    public void getPageIdByIshLogicalReferenceVerifyNullAsRootFlag() throws Exception {
        Item item = provider.getPageIdByIshLogicalReference(PUB_ID, LOGICAL_REF_VALUE);

        assertEquals(0, item.getId());
    }

    @Test(expected = ContentProviderException.class)
    public void getPageIdByIshLogicalReferenceVerifyNullNotOneResult() throws Exception {
        when(query.executeEntityQuery()).thenReturn(new Item[]{pageId, pageId});

        provider.getPageIdByIshLogicalReference(PUB_ID, LOGICAL_REF_VALUE);
    }

    @Test
    public void getPageIdByIshLogicalReferenceVerifyOneValidResult() throws Exception {
        when(query.executeEntityQuery()).thenReturn(new Item[]{pageId});

        assertEquals(pageId, provider.getPageIdByIshLogicalReference(PUB_ID, LOGICAL_REF_VALUE));
    }

    @Test(expected = ContentProviderException.class)
    public void getPageIdByIshLogicalReferenceVerifyException() throws Exception {
        when(query.executeEntityQuery()).thenThrow(StorageException.class);

        provider.getPageIdByIshLogicalReference(PUB_ID, LOGICAL_REF_VALUE);
    }

    @Test(expected = ContentProviderException.class)
    public void getPageIdByIshLogicalReferenceResultAsNull() throws Exception {
        when(query.executeEntityQuery()).thenReturn(null);

        provider.getPageIdByIshLogicalReference(PUB_ID, LOGICAL_REF_VALUE);
    }
}
