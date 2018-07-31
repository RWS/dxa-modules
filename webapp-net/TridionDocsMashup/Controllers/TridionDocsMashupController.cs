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
using Newtonsoft.Json.Linq;

namespace Sdl.Web.Modules.TridionDocsMashup.Controllers
{
    public class TridionDocsMashupController : EntityController
    {
        //todo : this should come from config 
        private string _udpContentUrl = "http://localhost:8081/udp/content";

        protected override ViewModel EnrichModel(ViewModel sourceModel)
        {
            StaticWidget staticWidget = base.EnrichModel(sourceModel) as StaticWidget;

            if (staticWidget != null)
            {
                //todo: should be removed !
                staticWidget.Query = GetQuery(staticWidget.Keywords);

                List<DocsContent> docsContent = GetDocsContent(staticWidget.Keywords);

                staticWidget.Title = docsContent?.FirstOrDefault().Title;

                if (staticWidget.DisplayContentAs.ToLower() == "embeddedcontent")
                {
                    staticWidget.EmbeddedContent = docsContent?.FirstOrDefault().Content;
                }
                else
                {
                    staticWidget.Link = docsContent?.FirstOrDefault().Link;
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

                            List<DocsContent> docsContent = GetDocsContent(keywords);

                            dynamicWidget.Title = docsContent?.FirstOrDefault().Title;

                            if (dynamicWidget.DisplayContentAs.ToLower() == "embeddedcontent")
                            {
                                dynamicWidget.EmbeddedContent = docsContent?.FirstOrDefault().Content;
                            }
                            else
                            {
                                dynamicWidget.Link = docsContent?.FirstOrDefault().Link;
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

        private List<DocsContent> GetDocsContent(Dictionary<string, KeywordModel> keywords)
        {
            ItemConnection item = GetDocsItemConnection(keywords);
            List<DocsContent> docsContent = ExtractDocsContent(item);
            return docsContent;
        }

        private ItemConnection GetDocsItemConnection(Dictionary<string, KeywordModel> keywords)
        {
            IGraphQLClient graphQL = new GraphQLClient.GraphQLClient(_udpContentUrl);

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
                        Scope = CriteriaScope.Publication
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
                ItemTypes = new List<PublicContentApi.ContentModel.ItemType> { PublicContentApi.ContentModel.ItemType.PAGE },
                And = customMetaFilters
            };

            //todo : decide about Pagination value
            //todo : Exception handling
            ItemConnection itemConnection = pca.ExecuteItemQuery(itemFilter, new Pagination { First = 10 }, null, null, true);

            return itemConnection;
        }

        private List<DocsContent> ExtractDocsContent(ItemConnection itemConnection)
        {
            if (itemConnection?.Edges == null)
            {
                return null;
            }

            var docContents = new List<DocsContent>();

            foreach (var item in itemConnection.Edges)
            {
                Page page = item.Node as Page;

                if (page != null)
                {
                    var docsContent = new DocsContent() { Link = page.Url, Title = page.Title };

                    if (page.ContainerItems != null)
                    {
                        foreach (ComponentPresentation componentPresentation in page.ContainerItems)
                        {
                            var component = componentPresentation?.RawContent?.Data["Component"] as JObject;
                            if (component != null)
                            {
                                var fields = component["Fields"];
                                if (fields != null)
                                {
                                    var sb = new StringBuilder();

                                    foreach (var body in fields["topicBody"]["Values"])
                                    {
                                        sb.AppendLine(body.ToString());
                                    }

                                    docsContent.Content = sb.ToString();
                                }
                            }
                        }
                    }

                    docContents.Add(docsContent);
                }
            }

            return docContents;
        }

        class DocsContent
        {
            public string Title { get; set; }
            public string Link { get; set; }
            public string Content { get; set; }
        }
    }
}

