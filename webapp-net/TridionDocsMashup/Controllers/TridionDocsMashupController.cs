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
                //todo: should be removed !
                staticWidget.Query = GetQuery(staticWidget.Keywords);

                var pcaClient = new PublicContentApiClient();

                DocsContent docsContent = pcaClient.GetDocsContentByKeywords(staticWidget.Keywords)?.FirstOrDefault();

                staticWidget.Title = docsContent?.Title;

                if (staticWidget.DisplayContentAs.ToLower() == "embeddedcontent")
                {
                    staticWidget.EmbeddedContent = docsContent?.Content;
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
                        string query = "query = ";

                        Dictionary<string, KeywordModel> keywords = new Dictionary<string, KeywordModel>();

                        // Should use reflection
                        foreach (var property in dynamicWidget.Properties)
                        {
                            KeywordModel keyword = product.GetType().GetProperty(property)?.GetValue(product) as KeywordModel;
                            if (keyword != null)
                            {
                                query += $" {property} { keyword.Id } '{ keyword.Title }'";
                                keywords.Add(property, keyword);
                            }
                        }

                        if (keywords.Any())
                        {
                            //todo: should be removed!
                            dynamicWidget.Query = GetQuery(keywords);

                            var pcaClient = new PublicContentApiClient();

                            DocsContent docsContent = pcaClient.GetDocsContentByKeywords(keywords)?.FirstOrDefault();

                            dynamicWidget.Title = docsContent?.Title;

                            if (dynamicWidget.DisplayContentAs.ToLower() == "embeddedcontent")
                            {
                                dynamicWidget.EmbeddedContent = docsContent?.Content;
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

        //todo: should be removed !
        private string GetQuery(Dictionary<string, KeywordModel> keywords)
        {
            var customMetas = new StringBuilder();

            foreach (var keyword in keywords)
            {
                customMetas.AppendLine(string.Format(@"{{ customMeta: {{ scope: {0}, key: ""{1}.version.element"", value: ""{2}""}} }},", "ItemInPublication", keyword.Key, keyword.Value.Id));
            }

            customMetas.AppendLine(string.Format(@"{{ customMeta: {{ scope: {0}, key: ""DOC-LANGUAGE.lng.value"", value: ""{1}""}} }}", "ItemInPublication", WebRequestContext.Localization.CultureInfo.Name));

            string query = string.Format(@"
                items(
                  filter: {{
                    itemTypes: [{0}]
                    and: [
                        {1}
                    ]
                  }}
                )", "Publication", customMetas.ToString());

            return query;
        }
    }
}

