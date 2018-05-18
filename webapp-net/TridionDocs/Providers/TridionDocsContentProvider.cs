using System;
using System.Collections;
using Sdl.Web.Common;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Models;
using Sdl.Web.Modules.TridionDocs.Exceptions;
using Sdl.Web.Tridion.Mapping;
using Tridion.ContentDelivery.DynamicContent.Query;
using Tridion.ContentDelivery.Meta;
using Sdl.Web.Tridion.ContentManager;
using Query = Tridion.ContentDelivery.DynamicContent.Query.Query;

namespace Sdl.Web.Modules.TridionDocs.Providers
{
    /// <summary>
    /// TridionDocs Content Provider
    /// </summary>
    public class TridionDocsContentProvider : DefaultContentProvider
    {
        private static readonly string RefFieldName = "ishlogicalref.object.id";
        private static readonly string DefaultPublishData = "1900-01-01 00:00:00.000";
        private static readonly string TocNaventriesMeta = "tocnaventries.generated.value";
        private static readonly string PageConditionsUsedMeta = "conditionsused.generated.value";

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

        public override PageModel GetPageModel(int pageId, ILocalization localization, bool addIncludes = true)
        {
            PageModel pageModel = base.GetPageModel(pageId, localization, addIncludes);
            if (pageModel != null)
            {
                // Enhance the page model with custom metadata
                PageMetaFactory pageMetaFactory = new PageMetaFactory(int.Parse(localization.Id));
                string cmId = $"ish:{localization.Id}-{pageId}-16";
                var pageMeta = pageMetaFactory.GetMeta(cmId);
                if (pageMeta != null)
                {
                    var customMeta = pageMeta.CustomMeta;

                    // Put the information about the toc entries on the metadata
                    // This is required by the UI so it knows the location of the page in the Toc
                    if (customMeta.GetFirstValue(TocNaventriesMeta) != null)
                    {
                        NameValuePair pair = (NameValuePair)customMeta.NameValues[TocNaventriesMeta];
                        var values = (ArrayList) pair.MultipleValues;
                        if (values != null)
                        {
                            pageModel.Meta.Add(TocNaventriesMeta, string.Join(", ", values.ToArray()));
                        }
                    }

                    // Put the information about used conditions form page metadata
                    if (customMeta.GetFirstValue(PageConditionsUsedMeta) != null)
                    {
                        pageModel.Meta.Add(PageConditionsUsedMeta, (string)customMeta.GetFirstValue(PageConditionsUsedMeta));
                    }

                    // Add logical Ref ID information
                    if (customMeta.GetFirstValue(RefFieldName) != null)
                    {
                        pageModel.Meta.Add(RefFieldName, (string)customMeta.GetFirstValue(RefFieldName));
                    }
                }
            }
            return pageModel;
        }

        public override PageModel GetPageModel(string urlPath, ILocalization localization, bool addIncludes = true)
        {
            return new PageModel
            {
                MvcData = new MvcData { ViewName = "ErrorPage", AreaName = "TridionDocs"}
            };
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
