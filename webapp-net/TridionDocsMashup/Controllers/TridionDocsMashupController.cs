using Sdl.Web.Common.Models;
using Sdl.Web.Modules.TridionDocsMashup.Models;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Mvc.Controllers;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System;

namespace Sdl.Web.Modules.TridionDocsMashup.Controllers
{
    public class TridionDocsMashupController : EntityController
    {
        protected override ViewModel EnrichModel(ViewModel sourceModel)
        {
            System.Diagnostics.Debugger.Launch();
            DocsContent docsContent = base.EnrichModel(sourceModel) as DocsContent;

            if (docsContent != null)
            {
                //to do : Use release name , family name and content type to query from Public Content Api and get respective data from tridion docs :)

                docsContent.EmbeddedContent = "Content from Tridion Docs";

                docsContent.Link = "Content link from Tridion Docs";

                docsContent.Query = GetQuery(docsContent.Keywords);
            }

            DocsContentViewModel docsContentViewModel = base.EnrichModel(sourceModel) as DocsContentViewModel;

            if (docsContentViewModel != null)
            {
                docsContentViewModel.EmbeddedContent = $"Content from Tridion Docs based on view model { docsContentViewModel.ProductViewModel }";
                docsContentViewModel.Link = "Content link from Tridion Docs";
                docsContentViewModel.Query = "my query";

                foreach (RegionModel regionModel in WebRequestContext.PageModel.Regions)
                {
                    EntityModel product = regionModel.Entities.FirstOrDefault(e => e.MvcData.ViewName == docsContentViewModel.ProductViewModel);

                    if (product != null)
                    {
                        string query = "query = ";

                        Dictionary<string, KeywordModel> keywords = new Dictionary<string, KeywordModel>();

                        // Should use reflection
                        foreach (var property in docsContentViewModel.Properties)
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
                            docsContentViewModel.Query = GetQuery(keywords);
                        }
                    }
                }
            }

            return sourceModel;
        }

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
