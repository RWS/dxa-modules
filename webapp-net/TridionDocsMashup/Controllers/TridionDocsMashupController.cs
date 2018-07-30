using Sdl.Web.Common.Models;
using Sdl.Web.Modules.TridionDocsMashup.Models;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Mvc.Controllers;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System;
using Sdl.Web.GraphQLClient;
using Sdl.Web.PublicContentApi;
using Sdl.Web.PublicContentApi.ContentModel;

namespace Sdl.Web.Modules.TridionDocsMashup.Controllers
{
    public class TridionDocsMashupController : EntityController
    {
        protected override ViewModel EnrichModel(ViewModel sourceModel)
        {
            StaticWidget docsContent = base.EnrichModel(sourceModel) as StaticWidget;

            if (docsContent != null)
            {
                //todo: should be removed !
                docsContent.Query = GetQuery(docsContent.Keywords);

                if (docsContent.DisplayContentAs.ToLower() == "embeddedcontent")
                {
                    docsContent.EmbeddedContent = GetDocsContent(docsContent.Keywords);
                }
                else
                {
                    docsContent.Link = GetDocsLink(docsContent.Keywords);
                }
            }

            DynamicWidget docsContentViewModel = base.EnrichModel(sourceModel) as DynamicWidget;

            if (docsContentViewModel != null)
            {
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
                            //todo: should be removed!
                            docsContentViewModel.Query = GetQuery(keywords);

                            if (docsContentViewModel.DisplayContentAs.ToLower() == "embeddedcontent")
                            {
                                docsContentViewModel.EmbeddedContent = GetDocsContent(keywords);
                            }
                            else
                            {
                                docsContentViewModel.Link = GetDocsLink(keywords);
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

        private ItemConnection GetDocsItemConnection(Dictionary<string, KeywordModel> keywords)
        {
            //todo : this should come from config 
            var url = "http://localhost:8081/udp/content";

            IGraphQLClient graphQL = new GraphQLClient.GraphQLClient(url);

            IPublicContentApi pca = new PublicContentApi.PublicContentApi(graphQL);

            var customMetaFilters = new List<InputItemFilter>();

            foreach (var keyword in keywords)
            {
                var keywordFilter = new InputItemFilter
                {
                    CustomMeta = new InputCustomMetaCriteria
                    {
                        Key = $"{keyword.Key}.version.element",
                        Value = keyword.Value.Id,
                        Scope = CriteriaScope.ItemInPublication
                    }
                };

                customMetaFilters.Add(keywordFilter);
            }

            var languageFilter = new InputItemFilter
            {
                CustomMeta = new InputCustomMetaCriteria
                {
                    Key = "DOC-LANGUAGE.lng.value",
                    Value = WebRequestContext.Localization.CultureInfo.Name,
                    Scope = CriteriaScope.ItemInPublication
                }
            };

            customMetaFilters.Add(languageFilter);

            InputItemFilter itemFilter = new InputItemFilter
            {
                NamespaceIds = new List<ContentNamespace> { ContentNamespace.Docs },
                ItemTypes = new List<PublicContentApi.ContentModel.ItemType> { PublicContentApi.ContentModel.ItemType.PUBLICATION },
                And = customMetaFilters
            };

            //todo : decide about Pagination value
            //todo : Exception handling
            ItemConnection itemConnection = pca.ExecuteItemQuery(itemFilter, new Pagination { First = 10 }, null, null);

            return itemConnection;
        }

        private string GetDocsContent(Dictionary<string, KeywordModel> keywords)
        {
            ItemConnection item = GetDocsItemConnection(keywords);

            //to do :  extract the content from ItemConnection
            return item.Edges.FirstOrDefault().Node.Title;
        }

        private string GetDocsLink(Dictionary<string, KeywordModel> keywords)
        {
            ItemConnection item = GetDocsItemConnection(keywords);

            //to do : extract the link from ItemConnection
            return item.Edges.FirstOrDefault().Node.Title;
        }

    }
}

