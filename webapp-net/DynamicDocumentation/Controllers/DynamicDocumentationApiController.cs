using System;
using System.Web.Mvc;
using Sdl.Web.Common;
using Sdl.Web.Modules.DynamicDocumentation.Providers;
using Sdl.Web.Mvc.Configuration;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Modules.DynamicDocumentation.Exceptions;
using Sdl.Web.Modules.DynamicDocumentation.Models;
using Sdl.Web.Tridion.ContentManager;
using Sdl.Web.Tridion.TridionDocs.Controllers;
using Tridion.ContentDelivery.DynamicContent.Query;
using Tridion.ContentDelivery.Meta;
using Query = Sdl.Web.Common.Models.Query;

namespace Sdl.Web.Modules.DynamicDocumentation.Controllers
{
    /// <summary>
    /// Api Controller
    /// </summary>
    public class DynamicDocumentationApiController : ApiController
    {
        private static readonly string TocNaventriesMeta = "tocnaventries.generated.value";
        private static readonly string PageConditionsUsedMeta = "conditionsused.generated.value";
        private static readonly string PageLogicalRefObjectId = "ishlogicalref.object.id";
        private static readonly string RefFieldName = "ishlogicalref.object.id";
        private static readonly string DefaultPublishData = "1900-01-01 00:00:00.000";

        protected ILocalization SetupLocalization(int publicationId)
        {
            PublicationProvider provider = new PublicationProvider();
            provider.CheckPublicationOnline(publicationId);
            ILocalization localization = WebRequestContext.Localization;
            localization.Id = publicationId.ToString();
            return localization;
        }      
   
        [Route("~/api/publications")]
        [HttpGet]
        public virtual ActionResult Publications()
        {
            try
            {
                PublicationProvider provider = new PublicationProvider();
                return JsonResult(provider.PublicationList);
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
                return new ContentResult
                {
                    ContentType = "application/json",
                    Content = new ConditionProvider().GetConditions(publicationId),
                    ContentEncoding = Encoding.UTF8
                };
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
            ///return View("SiteMapXml", DDWebAppReactNavigationProvider.SiteMap);
            return new EmptyResult();
        }      

        [Route("~/api/pageIdByReference/{publicationId:int}/{ishFieldValue}")]
        public virtual ActionResult TopicIdInTargetPublication(int publicationId, string ishFieldValue)
        {
            try
            {
                SetupLocalization(publicationId);
                if (!string.IsNullOrEmpty(ishFieldValue))
                {
                    throw new DxaItemNotFoundException(
                        "Unable to use empty 'ishlogicalref.object.id' value as a search criteria.");
                }
                return Json(GetPageIdByIshLogicalReference(publicationId, ishFieldValue));

            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }
      
        private ContentResult JsonResult(object result)
        {
            return new ContentResult
            {
                ContentType = "application/json",
                Content = JsonConvert.SerializeObject(result, new IsoDateTimeConverter() { DateTimeFormat = "yyyy-MM-ddThh:mm:ssZ" }),
                ContentEncoding = Encoding.UTF8
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
                Criteria composite = new AndCriteria(new[] { dateCriteria, refCriteria, itemType, pubCriteria });

                global::Tridion.ContentDelivery.DynamicContent.Query.Query query = new global::Tridion.ContentDelivery.DynamicContent.Query.Query(composite);
                IItem[] items = query.ExecuteEntityQuery();
                if (items == null || items.Length == 0)
                {
                    return new ItemImpl();
                }

                if (items.Length > 1)
                {
                    throw new ApiException($"Too many page Ids found in publication with logical ref value {ishLogicalRefValue}");
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
