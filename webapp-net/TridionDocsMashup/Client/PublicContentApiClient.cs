using DD4T.Serialization;
using Newtonsoft.Json.Linq;
using Sdl.Web.Common.Models;
using Sdl.Web.GraphQLClient;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.PublicContentApi;
using Sdl.Web.PublicContentApi.ContentModel;
using System.Collections.Generic;
using System.Linq;
using Sdl.Web.Modules.TridionDocsMashup.Models;

namespace Sdl.Web.Modules.TridionDocsMashup.Client
{
    public class PublicContentApiClient
    {
        private IPublicContentApi _publicContentApi;
        private JSONSerializerService _dd4tSerializer = new JSONSerializerService();

        public PublicContentApiClient()
        {
            //todo : should be removed , as PCA client itself will read it from the DiscoveryService
            string graphQLEndpoint = "http://stgecl2016:8081/udp/content";// "http://localhost:8081/udp/content";

            //todo : should be removed , as  PCA client will be provided and initialized by DXA , like SiteConfiguration.PublicContentApi;
            IGraphQLClient graphQLClient = new GraphQLClient.GraphQLClient(graphQLEndpoint, new OAuth());

            _publicContentApi = new PublicContentApi.PublicContentApi(graphQLClient);
        }

        public List<TridionDocsItem> GetTridionDocsItemsByKeywords(Dictionary<string, KeywordModel> keywords, int maxItems)
        {
            List<ItemEdge> result = ExecuteQuery(keywords, maxItems);
            List<TridionDocsItem> items = GetDocsItems(result);
            return items;
        }

        private List<ItemEdge> ExecuteQuery(Dictionary<string, KeywordModel> keywords, int maxItems)
        {
            if (maxItems < 1)
            {
                return null;
            }

            List<InputItemFilter> keywordFilters = GetKeyWordFilters(keywords);

            List<InputItemFilter> languageFilters = GetLanguageFilters();

            InputItemFilter filter = new InputItemFilter
            {
                NamespaceIds = new List<ContentNamespace> { ContentNamespace.Docs },
                ItemTypes = new List<PublicContentApi.ContentModel.ItemType> { PublicContentApi.ContentModel.ItemType.PAGE },
                And = keywordFilters,
                Or = languageFilters
            };

            ItemConnection item = _publicContentApi.ExecuteItemQuery(filter, new Pagination { First = maxItems }, null, null, true);

            if (item?.Edges == null)
            {
                return null;
            }

            var items = FilterItemsByLanguage(item);

            return items;
        }

        private List<TridionDocsItem> GetDocsItems(List<ItemEdge> result)
        {
            var docsItems = new List<TridionDocsItem>();

            if (result != null)
            {
                foreach (var edge in result)
                {
                    Page page = edge.Node as Page;

                    if (page != null)
                    {
                        var docsItem = new TridionDocsItem()
                        {
                            //todo : the page.Url doesn't have the host name, we need to get it from somewhere (maybe discovery service)
                            Link = page.Url, //
                            Title = page.Title
                        };

                        if (page.ContainerItems != null)
                        {
                            foreach (ComponentPresentation componentPresentation in page.ContainerItems)
                            {
                                string componentDD4TJson = (componentPresentation?.RawContent?.Data["Component"] as JObject)?.ToString();

                                if (!string.IsNullOrEmpty(componentDD4TJson))
                                {
                                    DD4T.ContentModel.Component component = _dd4tSerializer.Deserialize<DD4T.ContentModel.Component>(componentDD4TJson);
                                    docsItem.Body = component?.Fields["topicBody"]?.Value;
                                }
                            }
                        }

                        docsItems.Add(docsItem);
                    }
                }
            }

            return docsItems;
        }

        private List<ItemEdge> FilterItemsByLanguage(ItemConnection item)
        {
            List<ItemEdge> pagesInLocalLanguage = new List<ItemEdge>();

            var localLanguage = WebRequestContext.Localization.CultureInfo.Name.ToLower();

            foreach (var edge in item.Edges)
            {
                if (edge.Node.CustomMetas.Edges.Where(e => e.Node.Key == "DOC-LANGUAGE.lng.value").Any(l => l.Node?.Value?.ToLower() == localLanguage))
                {
                    pagesInLocalLanguage.Add(edge);
                }
            }

            return pagesInLocalLanguage.Any() ? pagesInLocalLanguage : item.Edges;
        }

        private static List<InputItemFilter> GetKeyWordFilters(Dictionary<string, KeywordModel> keywords)
        {
            var keyWordFilters = new List<InputItemFilter>();

            foreach (var keyword in keywords)
            {
                var keywordFilter = new InputItemFilter
                {
                    CustomMeta = new InputCustomMetaCriteria
                    {
                        Key = GetKeywordKey(keyword.Key),
                        Value = keyword.Value.Id,
                        Scope = GetKeywordScope(keyword.Key)
                    }
                };

                keyWordFilters.Add(keywordFilter);
            }

            return keyWordFilters;
        }

        private static List<InputItemFilter> GetLanguageFilters()
        {
            var languages = GetLanguages();

            var languageFilters = new List<InputItemFilter>();

            foreach (var lang in languages)
            {
                var langFilter = new InputItemFilter
                {
                    CustomMeta = new InputCustomMetaCriteria
                    {
                        Key = "DOC-LANGUAGE.lng.value",
                        Value = lang,
                        Scope = CriteriaScope.Publication
                    }
                };

                languageFilters.Add(langFilter);
            }

            return languageFilters;
        }

        private static string GetKeywordKey(string keywordKey)
        {
            string scop = keywordKey.Split('.')?[0];
            string key = keywordKey.Replace(scop + ".", string.Empty);
            return key + ".element";
        }

        private static CriteriaScope GetKeywordScope(string keywordKey)
        {
            string scope = keywordKey.Split('.')?[0];

            switch (scope?.ToLower())
            {
                case "item":
                    return CriteriaScope.Item;
                case "iteminpublication":
                    return CriteriaScope.ItemInPublication;
            }

            return CriteriaScope.Publication;
        }

        private static List<string> GetLanguages()
        {
            var localLanguage = WebRequestContext.Localization.CultureInfo;

            var languages = new List<string>() { localLanguage.Name };

            if (localLanguage.Parent?.Name != null)
            {
                languages.Add(localLanguage.Parent.Name);
            }

            return languages;
        }

    }
}
