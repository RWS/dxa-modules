using Sdl.Web.Common.Models;
using Sdl.Web.Modules.TridionDocsMashup.Models;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Mvc.Controllers;
using System.Collections.Generic;
using System.Text;
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

                DocsItemContent docsContent = pcaClient.GetDocsContentByKeywords(staticWidget.Keywords)?.FirstOrDefault();

                staticWidget.Title = docsContent?.Title;

                if (staticWidget.DisplayContentAs.ToLower() == "embedded content")
                {
                    staticWidget.EmbeddedContent = docsContent?.Body;
                }
                else
                {
                    staticWidget.Link = docsContent?.Link;
                }
            }

            DynamicWidget dynamicWidget = base.EnrichModel(sourceModel) as DynamicWidget;

            if (dynamicWidget != null)
            {
                foreach (RegionModel regionModel in WebRequestContext.PageModel.Regions)
                {
                    EntityModel product = regionModel.Entities.FirstOrDefault(e => e.MvcData.ViewName == dynamicWidget.ProductViewModel);

                    if (product != null)
                    {
                        Dictionary<string, KeywordModel> keywords = new Dictionary<string, KeywordModel>();

                        // Should use reflection
                        foreach (var property in dynamicWidget.Properties)
                        {
                            KeywordModel keyword = product.GetType().GetProperty(property)?.GetValue(product) as KeywordModel;
                            if (keyword != null)
                            {
                                keywords.Add(property, keyword);
                            }
                        }

                        if (keywords.Any())
                        {
                            var pcaClient = new PublicContentApiClient();

                            DocsItemContent docsContent = pcaClient.GetDocsContentByKeywords(keywords)?.FirstOrDefault();

                            dynamicWidget.Title = docsContent?.Title;

                            if (dynamicWidget.DisplayContentAs.ToLower() == "embedded content")
                            {
                                dynamicWidget.EmbeddedContent = docsContent?.Body;
                            }
                            else
                            {
                                dynamicWidget.Link = docsContent?.Link;
                            }
                        }
                    }
                }
            }

            return sourceModel;
        }
    }
}

