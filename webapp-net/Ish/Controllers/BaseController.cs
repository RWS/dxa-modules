using System.Collections.Generic;
using System.Web.Mvc;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Models;
using Sdl.Web.Modules.Ish.Exceptions;
using Sdl.Web.Modules.Ish.Navigation;
using Sdl.Web.Modules.Ish.Providers;
using Sdl.Web.Mvc.Configuration;
using Tridion.ContentDelivery.Meta;

namespace Sdl.Web.Modules.Ish.Controllers
{
    [RouteArea("Ish")]
    public class BaseController : Mvc.Controllers.PageController
    {
        private static readonly string TocNaventriesMeta = "tocnaventries.generated.value";
        private static readonly string PageConditionsUsedMeta = "conditionsused.generated.value";
        private static readonly string PageLogicalRefObjectId = "ishlogicalref.object.id";

        private IshContentProvider _contentProvider;

        protected ILocalization SetupLocalization(int publicationId)
        {
            PublicationProvider provider = new PublicationProvider();
            provider.CheckPublicationOnline(publicationId);
            ILocalization localization = WebRequestContext.Localization;
            localization.Id = publicationId.ToString();
            return localization;
        }

        protected override ViewModel EnrichModel(ViewModel model)
        {
            PageModel pageModel = model as PageModel;
            if (pageModel == null)
            {
                return model;
            }
            ILocalization localization = WebRequestContext.Localization;
            PageMetaFactory pageMetaFactory = new PageMetaFactory(localization.Id);         
            var pageMeta = pageMetaFactory.GetMeta(pageModel.Id);
            if (pageMeta != null)
            {
                var customMeta = pageMeta.CustomMeta;

                if (customMeta.GetFirstValue(TocNaventriesMeta) != null)
                {
                    // Take the generated product family name from the metadata
                    NameValuePair tocNavEntries = (NameValuePair)customMeta.NameValues[TocNaventriesMeta];
                    List<string> values = (List<string>) tocNavEntries?.MultipleValues;
                    if (values != null)
                    {
                        pageModel.Meta.Add(TocNaventriesMeta, string.Join(", ", values));
                    }
                }

                // Put the information about used conditions form page metadata
                if (customMeta.GetFirstValue(PageConditionsUsedMeta) != null)
                {
                    pageModel.Meta.Add(PageConditionsUsedMeta, (string)customMeta.GetFirstValue(PageConditionsUsedMeta));
                }

                // Add logical Ref ID information
                if (customMeta.GetFirstValue(PageLogicalRefObjectId) != null)
                {
                    pageModel.Meta.Add(PageLogicalRefObjectId, (string)customMeta.GetFirstValue(PageLogicalRefObjectId));
                }
            }
            return model;
        }

        protected IshContentProvider IshContentProvider
        {
            get
            {
                if (!(ContentProvider is IshContentProvider))
                {
                    throw new IshApiException(
                        "IshContentProvider not configured. Please make sure you have the IshContentProvider specified in your Unity.config");
                }
                return ContentProvider as IshContentProvider;
            }
        }

        protected IshNavigationProvider IshNavigationProvider
        {
            get
            {
                INavigationProvider navProvider = SiteConfiguration.NavigationProvider;
                if (!(navProvider is IshNavigationProvider))
                {
                    throw new IshApiException(
                        "IshNavigationProvider not configured. Please make sure you have the IshNavigationProvider specified in your Unity.config");

                }
                return navProvider as IshNavigationProvider;
            }
        }
    }
}
