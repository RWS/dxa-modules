using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Newtonsoft.Json;
using Sdl.Tridion.Api.Client;
using Sdl.Tridion.Api.Client.ContentModel;
using Sdl.Web.Common;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Sdl.Web.Delivery.ServicesCore.ClaimStore;
using Sdl.Web.Modules.DynamicDocumentation.Models;
using Sdl.Web.Modules.DynamicDocumentation.Providers;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Mvc.Controllers;
using Sdl.Web.Mvc.Formats;
using Sdl.Web.Tridion.ApiClient;
using ConditionProvider = Sdl.Web.Modules.DynamicDocumentation.Providers.ConditionProvider;
using PublicationProvider = Sdl.Web.Modules.DynamicDocumentation.Providers.PublicationProvider;

namespace Sdl.Web.Modules.DynamicDocumentation.Controllers
{  
    /// <summary>
    /// Api Controller for Docs content
    /// </summary>
    public class ApiController : BaseController
    {
        private static readonly Uri UserConditionsUri = new Uri("taf:ish:userconditions:merged");
        private static readonly string TocNaventriesMeta = "tocnaventries.generated.value";
        private static readonly string PageConditionsUsedMeta = "conditionsused.generated.value";
        private static readonly string PageLogicalRefObjectId = "ishlogicalref.object.id";
        private static readonly string RefFieldName = "ishlogicalref.object.id";

        private static Common.Configuration.Localization Localization => WebRequestContext.Localization;
        private IContentProviderExt ContentProviderExt => (IContentProviderExt) ContentProvider;

        [Route("~/api/publications")]
        public virtual ActionResult Publications()
        {
            try
            {
                return JsonResult(new PublicationProvider().PublicationList);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [Route("~/api/conditions/{publicationId:int}")]
        public virtual ActionResult Conditions(int publicationId)
        {
            try
            {
                return JsonResult(new ConditionProvider().GetConditionsJson(publicationId));
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [Route("~/api/page/{publicationId:int}/{pageId:int}")]
        public virtual ActionResult Page(int publicationId, int pageId)
        {
            try
            {
                AddUserConditions();
                var model = EnrichModel(ContentProviderExt.GetPageModel(pageId, Localization), publicationId);
                return JsonResult(model);
            }
            catch (Exception ex)
            {
                Log.Error(ex);
                return
                    ServerError(new DxaItemNotFoundException(pageId.ToString(), publicationId.ToString()));
            }
        }

        [Route("~/api/page/{publicationId:int}/{pageId:int}/{*content}")]
        public virtual ActionResult Page(int publicationId, int pageId, string content)
        {
            try
            {
                AddUserConditions();
                var model = EnrichModel(ContentProviderExt.GetPageModel(pageId, Localization), publicationId);
                return JsonResult(model);
            }
            catch (Exception ex)
            {
                Log.Error(ex);
                return ServerError(ex);
            }
        }

        [Route("~/api/topic/{publicationId:int}/{componentId:int}/{templateId:int}")]
        public virtual ActionResult Topic(int publicationId, int componentId, int templateId)
        {
            try
            {
                AddUserConditions();
                var model = EnrichModel(ContentProviderExt.GetEntityModel($"{componentId}-{templateId}", Localization));
                return JsonResult(model);
            }
            catch (Exception ex)
            {
                Log.Error(ex);
                return
                    ServerError(
                        new DxaItemNotFoundException($"{componentId}-{templateId}", publicationId.ToString()));
            }
        }          

        [Route("~/binary/{publicationId:int}/{binaryId:int}/{*content}")]
        [Route("~/api/binary/{publicationId:int}/{binaryId:int}/{*content}")]
        [FormatData]
        public virtual ActionResult Binary(int publicationId, int binaryId)
        {
            try
            {
                StaticContentItem content = ContentProviderExt.GetStaticContentItem(binaryId, Localization);
                return new FileStreamResult(content.GetContentStream(), content.ContentType);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [Route("~/api/toc/{publicationId:int}")]
        public virtual ActionResult RootToc(int publicationId, string conditions = "")
        {
            try
            {
                AddUserConditions();
                return JsonResult(new TocProvider().GetToc(Localization));
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [Route("~/api/toc/{publicationId:int}/{sitemapItemId}")]
        public virtual ActionResult Toc(int publicationId, string sitemapItemId, string conditions = "",
            bool includeAncestors = false)
        {
            try
            {
                AddUserConditions();
                var sitemapItems = new TocProvider().GetToc(Localization, sitemapItemId, includeAncestors).ToList();
                return JsonResult(sitemapItems);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [Route("~/api/sitemap.xml")]
        public virtual ActionResult SitemapXml()
        {
            // Use the common SiteMapXml view for rendering out the xml of all the sitemap items.
            return View("SiteMapXml", new TocProvider().SiteMap(Localization));
        }
   
        [Route("~/api/pageIdByReference/{publicationId:int}/{ishFieldValue}")]
        public virtual ActionResult TopicIdInTargetPublication(int publicationId, string ishFieldValue)
        {
            try
            {
                if (!string.IsNullOrEmpty(ishFieldValue))
                {
                    throw new DxaItemNotFoundException(
                        "Unable to use empty 'ishlogicalref.object.id' value as a search criteria.");
                }
                return JsonResult(GetPageIdByIshLogicalReference(publicationId, ishFieldValue));
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        public Item GetPageIdByIshLogicalReference(int publicationId, string ishLogicalRefValue)
        {
            try
            {
                Item item = new Item();
                var client = ApiClientFactory.Instance.CreateClient();
                InputItemFilter filter = new InputItemFilter
                {
                    NamespaceIds = new List<ContentNamespace> {ContentNamespace.Docs},
                    PublicationIds = new List<int?> {publicationId},
                    ItemTypes = new List<FilterItemType> {FilterItemType.PAGE},
                    CustomMeta = new InputCustomMetaCriteria
                    {
                        Key = RefFieldName,
                        Value = ishLogicalRefValue,
                        ValueType = CustomMetaValueType.STRING,
                        Scope = CriteriaScope.ItemInPublication
                    }
                };
                var items = client.ExecuteItemQuery(filter,
                    new InputSortParam {Order = SortOrderType.Ascending, SortBy = SortFieldType.CREATION_DATE},
                    new Pagination {First = 1}, null, ContentIncludeMode.Exclude, false, null);
                if (items?.Edges == null || items.Edges.Count != 1) return item;
                item.Id = items.Edges[0].Node.ItemId;
                item.PublicationId = items.Edges[0].Node.PublicationId;
                item.Title = items.Edges[0].Node.Title;
                return item;
            }
            catch (Exception)
            {
                throw new DxaItemNotFoundException(
                    $"Page reference by ishlogicalref.object.id = {ishLogicalRefValue} not found in publication {publicationId}.");
            }
        }

        #region Routes for incorrect API usage
        // Handle routes that should return errors for incorrect API usage such as passing
        // string values for ids instead of integers. 
        [Route("~/api/topic/{publicationId}/{componentId}/{templateId}")]
        public virtual ActionResult Topic(string publicationId, string componentId, string templateId)
          =>
              ServerError(
                  new DxaItemNotFoundException($"{componentId}-{templateId}", publicationId), 400);

        [Route("~/api/page/{publicationId}/{pageId}")]
        public virtual ActionResult Page(string publicationId, string pageId)
            => ServerError(new DxaItemNotFoundException(pageId, publicationId), 400);

        [Route("~/binary/{publicationId}/{binaryId}")]
        [Route("~/api/binary/{publicationId}/{binaryId}")]
        [FormatData]
        public virtual ActionResult Binary(string publicationId, string binaryId) => ServerError(null, 400);

        [Route("~/api/toc/{publicationId}/{sitemapItemId}")]
        public virtual ActionResult Toc(string publicationId, string sitemapItemId) => ServerError(null, 400);
        #endregion      

        protected virtual ViewModel EnrichModel(ViewModel model, int publicationId)
        {
            PageModel pageModel = model as PageModel;
            if (pageModel == null) return model;          
            var client = ApiClientFactory.Instance.CreateClient();
            var page = client.GetPage(ContentNamespace.Docs, publicationId, int.Parse(pageModel.Id),
                $"requiredMeta:{TocNaventriesMeta},{PageConditionsUsedMeta},{PageLogicalRefObjectId}",
                ContentIncludeMode.Exclude, null);
            if (page?.CustomMetas == null) return model;
            foreach (var x in page.CustomMetas.Edges)
            {
                if (TocNaventriesMeta.Equals(x.Node.Key))
                {
                    if (pageModel.Meta.ContainsKey(TocNaventriesMeta))
                    {
                        pageModel.Meta[TocNaventriesMeta] = $"{pageModel.Meta[TocNaventriesMeta]}, {x.Node.Value}";
                    }
                    else
                    {
                        pageModel.Meta.Add(TocNaventriesMeta, x.Node.Value);
                    }                    
                }
                if (PageConditionsUsedMeta.Equals(x.Node.Key))
                {
                    pageModel.Meta.Add(PageConditionsUsedMeta, x.Node.Value);
                }
                if (PageLogicalRefObjectId.Equals(x.Node.Key) && !pageModel.Meta.ContainsKey(PageLogicalRefObjectId))
                {
                    pageModel.Meta.Add(PageLogicalRefObjectId, x.Node.Value);
                }
            }
            return model;
        }

        protected void AddUserConditions()
        {
            try
            {
                var conditions = Request.QueryString["conditions"] ?? Request.Params["conditions"];
                if (string.IsNullOrEmpty(conditions)) return;
                // This will alter the caching key(s) used for retreival of content based on user conditions
                WebRequestContext.CacheKeySalt = conditions.GetHashCode(); 
                var userConditions = JsonConvert.DeserializeObject<Conditions>(conditions);
                var claimStore = AmbientDataContext.CurrentClaimStore;
                if (claimStore == null)
                {
                    // If the claimstore is null we must not be running the ADF module so we create our own claimstore
                    claimStore = new Sdl.Web.Delivery.ADF.ClaimStore.ClaimStore();
                    AmbientDataContext.CurrentClaimStore = claimStore;
                    AmbientDataContext.ForwardedClaims = new List<string> {UserConditionsUri.ToString()};
                }
                // Add our user conditions claim. This claim should be added in the cd_ambient_conf.xml configuration
                // so it is correctly forwarded to the PCA service.
                claimStore.Put(UserConditionsUri, new ConditionProvider().GetMergedConditions(userConditions));               
            }
            catch (Exception ex)
            {
                Log.Error("Failed to add condition claim");
                Log.Error(ex);
            }            
        }

        private ActionResult JsonResult(object obj) => Content(JsonConvert.SerializeObject(obj), "application/json");

        private ActionResult JsonResult(string obj) => Content(obj, "application/json");

        protected ActionResult ServerError(Exception ex, int statusCode = 404)
        {
            Response.StatusCode = statusCode;
            if (ex == null) return new EmptyResult();
            if (ex.InnerException != null) ex = ex.InnerException;
            return Content("{ \"Message\": \"" + ex.Message + "\" }", "application/json");
        }
    }
}
