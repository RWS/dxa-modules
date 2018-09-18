using System.Web.Mvc;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Tridion.TridionDocs.Providers;

namespace Sdl.Web.Modules.DynamicDocumentation.Controllers
{
    [RouteArea("DynamicDocumentation")]
    public class BaseController : Mvc.Controllers.PageController
    {
        private static readonly string TocNaventriesMeta = "tocnaventries.generated.value";
        private static readonly string PageConditionsUsedMeta = "conditionsused.generated.value";
        private static readonly string PageLogicalRefObjectId = "ishlogicalref.object.id";
     
        protected ILocalization SetupLocalization(int publicationId)
        {
            PublicationProvider provider = new PublicationProvider();
            provider.CheckPublicationOnline(publicationId);
            ILocalization localization = WebRequestContext.Localization;
            localization.Id = publicationId.ToString();
            return localization;
        }       
    }
}
