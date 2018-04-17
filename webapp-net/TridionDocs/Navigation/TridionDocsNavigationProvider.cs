using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Models;
using Sdl.Web.Common.Models.Navigation;
using Sdl.Web.Modules.TridionDocs.Models;
using Sdl.Web.Tridion.ContentManager;
using Tridion.ContentDelivery.Meta;
using Tridion.ContentDelivery.Taxonomies;

namespace Sdl.Web.Modules.TridionDocs.Navigation
{
    public class TridionDocsNavigationProvider : Tridion.Navigation.CILImpl.DynamicNavigationProvider
    {
        public string GetBaseUrl()
        {
            var request = HttpContext.Current.Request;
            var appUrl = HttpRuntime.AppDomainAppVirtualPath;

            if (appUrl != "/")
                appUrl = "/" + appUrl;

            var baseUrl = $"{request.Url.Scheme}://{request.Url.Authority}{appUrl}";

            return baseUrl;
        }

        protected override TaxonomyNode CreateTaxonomyNode(Keyword keyword, int expandLevels, NavigationFilter filter, ILocalization localization)
        {
            TaxonomyNode node = base.CreateTaxonomyNode(keyword, expandLevels, filter, localization);
            string ishRefUri = (string)keyword.KeywordMeta.GetFirstValue("ish.ref.uri");
            if (ishRefUri != null)
            {
                var ish = CmUri.FromString(ishRefUri);
                node.Url = $"{GetBaseUrl()}/{ish.PublicationId}/{ish.ItemId}";
            }
            return node;
        }

        public SitemapItem SiteMap
        {
            get
            {
                SitemapItem root = new SitemapItem();
                PublicationMetaFactory factory = new PublicationMetaFactory();
                string json = factory.GetSiteMapForPublication(-1);
                List<PublicationSiteMap> siteMap = JsonConvert.DeserializeObject<List<PublicationSiteMap>>(json);
                foreach (var url in siteMap.SelectMany(x => x.Urls))
                {
                    root.Items.Add(new SitemapItem {Type = "Page", Url = $"/{url.Url.TrimStart('/')}", PublishedDate = url.LastModifiedDate});
                }
                return root;
            }
        }
    }
}
