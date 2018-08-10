using Sdl.Web.Common.Models;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Mvc.Controllers;
using System.Collections.Generic;
using System.Linq;
using Sdl.Web.Modules.TridionDocsMashup.Client;
using Sdl.Web.Modules.TridionDocsMashup.Models.Widgets;
using Sdl.Web.Modules.TridionDocsMashup.Models.Products;

namespace Sdl.Web.Modules.TridionDocsMashup.Controllers
{
    public class TridionDocsMashupController : EntityController
    {
        protected override ViewModel EnrichModel(ViewModel sourceModel)
        {
            StaticWidget staticWidget = base.EnrichModel(sourceModel) as StaticWidget;

            if (staticWidget != null && staticWidget.Keywords != null)
            {
                var pcaClient = new PublicContentApiClient();

                staticWidget.Topics = pcaClient.GetTridionDocsTopicsByKeywords(staticWidget.Keywords, staticWidget.MaxItems);
            }

            DynamicWidget dynamicWidget = base.EnrichModel(sourceModel) as DynamicWidget;

            if (dynamicWidget != null && dynamicWidget.Keywords != null)
            {
                var pcaClient = new PublicContentApiClient();

                foreach (RegionModel regionModel in WebRequestContext.PageModel.Regions)
                {
                    Product product = regionModel.Entities?.FirstOrDefault(e => e.MvcData.ViewName == dynamicWidget.ProductViewModel) as Product;

                    if (product != null && product.Keywords != null)
                    {
                        var keywords = new Dictionary<string, KeywordModel>();

                        foreach (var keywordName in dynamicWidget.Keywords)
                        {
                            KeyValuePair<string, KeywordModel> keyword = product.Keywords.FirstOrDefault(k => k.Key.Contains("." + keywordName + "."));

                            if (keyword.Value != null && !keywords.ContainsKey(keyword.Key))
                            {
                                keywords.Add(keyword.Key, keyword.Value);
                            }
                        }

                        if (keywords.Any())
                        {
                            dynamicWidget.Topics = pcaClient.GetTridionDocsTopicsByKeywords(keywords, dynamicWidget.MaxItems);
                        }

                        break;
                    }
                }
            }

            return sourceModel;
        }
    }
}

