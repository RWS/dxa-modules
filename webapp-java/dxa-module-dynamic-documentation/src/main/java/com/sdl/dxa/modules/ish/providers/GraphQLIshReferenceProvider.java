package com.sdl.dxa.modules.ish.providers;

import com.sdl.dxa.tridion.pcaclient.ApiClientProvider;
import com.sdl.web.pca.client.ApiClient;
import com.sdl.web.pca.client.contentmodel.Pagination;
import com.sdl.web.pca.client.contentmodel.enums.ContentIncludeMode;
import com.sdl.web.pca.client.contentmodel.enums.ContentNamespace;
import com.sdl.web.pca.client.contentmodel.generated.CriteriaScope;
import com.sdl.web.pca.client.contentmodel.generated.CustomMetaValueType;
import com.sdl.web.pca.client.contentmodel.generated.FilterItemType;
import com.sdl.web.pca.client.contentmodel.generated.InputCustomMetaCriteria;
import com.sdl.web.pca.client.contentmodel.generated.InputItemFilter;
import com.sdl.web.pca.client.contentmodel.generated.InputSortParam;
import com.sdl.web.pca.client.contentmodel.generated.ItemConnection;
import com.sdl.web.pca.client.contentmodel.generated.SortFieldType;
import com.sdl.web.pca.client.contentmodel.generated.SortOrderType;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.tridion.meta.Category;
import com.tridion.meta.Item;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;
import java.util.List;


/**
 * Provider to fetch meta information.
 */
@Component
@Slf4j
@Profile("!cil.providers.active")
public class GraphQLIshReferenceProvider implements IshReferenceProvider {

    @Autowired
    private ApiClientProvider pcaClientProvider;

    public Item getPageIdByIshLogicalReference(Integer publicationId, String ishLogicalRefValue)
            throws ContentProviderException {
        Item item = new IshReferenceItem();
        ApiClient client = pcaClientProvider.getClient();
        InputItemFilter filter = new InputItemFilter();

        filter.setNamespaceIds(Arrays.asList(ContentNamespace.Docs.getNameSpaceValue()));
        filter.setPublicationIds(Arrays.asList(publicationId));
        List<FilterItemType> itemTypes = Arrays.asList(FilterItemType.PAGE);
        filter.setItemTypes(itemTypes);
        InputCustomMetaCriteria customMeta = new InputCustomMetaCriteria();
        customMeta.setKey(REF_FIELD_NAME);
        customMeta.setValue(ishLogicalRefValue);
        customMeta.setValueType(CustomMetaValueType.STRING);
        customMeta.setScope(CriteriaScope.ItemInPublication);
        filter.setCustomMeta(customMeta);

        InputSortParam inputSortParam = new InputSortParam();
        inputSortParam.setOrder(SortOrderType.Ascending);
        inputSortParam.setSortBy(SortFieldType.CREATION_DATE);

        Pagination pagination = new Pagination();
        pagination.setFirst(1);

        ItemConnection items = client.executeItemQuery(filter,
                inputSortParam,
                pagination, null,
                ContentIncludeMode.EXCLUDE, false, null);

        if (items == null || items.getEdges() == null || items.getEdges().size() != 1) {
            return item;
        }

        com.sdl.web.pca.client.contentmodel.generated.Item node = items.getEdges().get(0).getNode();
        item = new IshReferenceItem(node.getItemId(), node.getTitle(), node.getPublicationId());
        return item;
    }

    private class IshReferenceItem implements Item {
        private int namespaceId;
        private int id;
        private int type;
        private String title;
        private int minorVersion;
        private int majorVersion;
        private Date modificationDate;
        private Date initialPublicationDate;
        private Date lastPublicationDate;
        private Date creationDate;
        private int publicationId;
        private int owningPublicationId;
        private Category[] categories;

        public IshReferenceItem() {
        }

        public IshReferenceItem(int id, String title, int publicationId) {
            this.id = id;
            this.title = title;
            this.publicationId = publicationId;
        }

        @Override
        public int getNamespaceId() {
            return namespaceId;
        }

        @Override
        public int getId() {
            return id;
        }

        @Override
        public int getType() {
            return type;
        }

        @Override
        public String getTitle() {
            return title;
        }

        @Override
        public int getMinorVersion() {
            return minorVersion;
        }

        @Override
        public int getMajorVersion() {
            return majorVersion;
        }

        @Override
        public Date getModificationDate() {
            return modificationDate;
        }

        @Override
        public Date getInitialPublicationDate() {
            return initialPublicationDate;
        }

        @Override
        public Date getLastPublicationDate() {
            return lastPublicationDate;
        }

        @Override
        public Date getCreationDate() {
            return creationDate;
        }

        @Override
        public int getPublicationId() {
            return publicationId;
        }

        @Override
        public int getOwningPublicationId() {
            return owningPublicationId;
        }

        @Override
        public Category[] getCategories() {
            return categories;
        }
    }
}
