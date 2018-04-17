using System;
using Sdl.Web.Common;
using Sdl.Web.Modules.TridionDocs.Exceptions;
using Sdl.Web.Tridion.Mapping;
using Tridion.ContentDelivery.DynamicContent.Query;
using Tridion.ContentDelivery.Meta;
using Sdl.Web.Tridion.ContentManager;

namespace Sdl.Web.Modules.TridionDocs.Providers
{
    /// <summary>
    /// TridionDocs Content Provider
    /// </summary>
    public class TridionDocsContentProvider : DefaultContentProvider
    {
        private static readonly string RefFieldName = "ishlogicalref.object.id";
        private static readonly string DefaultPublishData = "1900-01-01 00:00:00.000";

        public class ItemImpl : IItem
        {
            public void Dispose()
            {
            }

            public Category[] GetCategories()
            {
                return null;
            }

            public int Id { get; }
            public string Title { get; }
            public int MinorVersion { get; }
            public int MajorVersion { get; }
            public DateTime ModificationDate { get; }
            public DateTime InitialPublicationDate { get; }
            public DateTime LastPublicationDate { get; }
            public DateTime CreationDate { get; }
            public int PublicationId { get; }
            public int OwningPublicationId { get; }
        }

        public IItem GetPageIdByIshLogicalReference(int publicationId, string ishLogicalRefValue)
        {
            try
            {
                Criteria dateCriteria = new ItemLastPublishedDateCriteria(DefaultPublishData, Criteria.GreaterThanOrEqual);
                CustomMetaKeyCriteria metaKeyCriteria = new CustomMetaKeyCriteria(RefFieldName);
                Criteria refCriteria = new CustomMetaValueCriteria(metaKeyCriteria, ishLogicalRefValue);
                Criteria pubCriteria = new PublicationCriteria(publicationId);
                Criteria itemType = new ItemTypeCriteria((int)ItemType.Page);
                Criteria composite = new AndCriteria(new[] { dateCriteria, refCriteria, itemType, pubCriteria});

                Query query = new Query(composite);
                IItem[] items = query.ExecuteEntityQuery();
                if (items == null || items.Length == 0)
                {
                    return new ItemImpl();
                }

                if (items.Length > 1)
                {
                    throw new TridionDocsApiException($"Too many page Ids found in publication with logical ref value {ishLogicalRefValue}");
                }

                return items[0];
            }
            catch (Exception)
            {                
                throw new DxaItemNotFoundException($"Page reference by ishlogicalref.object.id = {ishLogicalRefValue} not found in publication {publicationId}.");
            }
        }
    }
}
