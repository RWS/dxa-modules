using Sdl.Web.Common.Models;
using Sdl.Web.Modules.TridionDocsMashup.Models;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Mvc.Controllers;
using System.Collections.Generic;
using System.Linq;
using Sdl.Web.Modules.TridionDocsMashup.Client;

namespace Sdl.Web.Modules.TridionDocsMashup.Controllers
{
    public class TridionDocsMashupController : EntityController
    {
        protected override ViewModel EnrichModel(ViewModel sourceModel)
        {
            StaticWidget staticWidget = base.EnrichModel(sourceModel) as StaticWidget;

            if (staticWidget != null)
            {
                var pcaClient = new PublicContentApiClient();

                staticWidget.TridionDocsItems = pcaClient.GetTridionDocsItemsByKeywords(staticWidget.Keywords, staticWidget.MaxItems);
            }

            DynamicWidget dynamicWidget = base.EnrichModel(sourceModel) as DynamicWidget;

            if (dynamicWidget != null)
            {
                var pcaClient = new PublicContentApiClient();

                foreach (RegionModel regionModel in WebRequestContext.PageModel.Regions)
                {
                    Product product = regionModel.Entities?.FirstOrDefault(e => e.MvcData.ViewName == dynamicWidget.ProductViewModel) as Product;

                    var keywords = new Dictionary<string, KeywordModel>();

                    if (product != null && product.Keywords != null)
                    {
                        foreach (var keywordName in dynamicWidget.Keywords)
                        {
                            KeyValuePair<string, KeywordModel> keyword = product.Keywords.FirstOrDefault(k => k.Key.Contains("." + keywordName + "."));

                            if (keyword.Value != null && !keywords.ContainsKey(keyword.Key))
                            {
                                keywords.Add(keyword.Key, keyword.Value);
                            }
                        }
                    }

                    if (keywords.Any())
                    {
                        dynamicWidget.TridionDocsItems = pcaClient.GetTridionDocsItemsByKeywords(keywords, dynamicWidget.MaxItems);
                    }
                }
            }

            return sourceModel;
        }
    }
}

