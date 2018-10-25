using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Sdl.Web.Common.Models;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Logging;
using Sdl.Web.DataModel;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.PublicContentApi;
using Sdl.Web.PublicContentApi.ContentModel;
using Sdl.Web.Tridion.Mapping;
using Sdl.Web.Tridion.PCAClient;
using Sdl.Web.Modules.TridionDocsMashup.Models.Widgets;

namespace Sdl.Web.Modules.TridionDocsMashup.Client
{
    /// <summary>
    /// This class is a wrapper around the actual PublicContentApi client 
    /// and tries to isolate the related logic and codes for creating the filters and performing the query 
    /// and processing the results
    /// </summary>
    public class PublicContentApiClient
    {
        private readonly IPublicContentApi _publicContentApi;

        public PublicContentApiClient()
        {
            _publicContentApi = PCAClientFactory.Instance.CreateClient();

            // Explicitly tell PCA client to only return R2 models
            _publicContentApi.DefaultModelType = DataModelType.R2;
            _publicContentApi.DefaultContentType = ContentType.MODEL;
            // Specify rendered links are absolute and not relative
            _publicContentApi.TcdlLinkRenderingType = TcdlLinkRendering.Absolute;
            _publicContentApi.ModelSericeLinkRenderingType = ModelServiceLinkRendering.Absolute;
            // Specify prefix urls if applicable
            _publicContentApi.TcdlLinkUrlPrefix = WebRequestContext.Localization?.GetConfigValue("tridiondocsmashup.PrefixForTopicsUrl");           
            _publicContentApi.TcdlBinaryLinkUrlPrefix = WebRequestContext.Localization?.GetConfigValue("tridiondocsmashup.PrefixForBinariesUrl");
        }

        /// <summary>
        /// Returns a collection of Tridion docs topics based on the provided keywords 
        /// </summary>
        public List<Topic> GetTridionDocsTopicsByKeywords(Dictionary<string, KeywordModel> keywords, int maxItems)
        {
            List<ItemEdge> results = ExecuteQuery(keywords, maxItems);
            List<Topic> topics = GetDocsTopics(results);
            return topics;
        }

        /// <summary>
        /// Creates the required filters and peforms the query to fetch and return the results  
        /// </summary>
        private List<ItemEdge> ExecuteQuery(Dictionary<string, KeywordModel> keywords, int maxItems)
        {
            if (maxItems < 1)
            {
                return null;
            }

            List<InputItemFilter> keywordFilters = GetKeyWordFilters(keywords);

            // First , we filter the query based on the specified language in the current culture.
            InputItemFilter languageFilter = GetLanguageFilter(WebRequestContext.Localization.CultureInfo.Name);

            ItemConnection results = ExecuteItemQuery(keywordFilters, languageFilter, maxItems);

            // If no result, then we do another query based on the parent language (if exists).
            if (results?.Edges == null || !results.Edges.Any())
            {
                var parentLanguage = WebRequestContext.Localization.CultureInfo.Parent?.Name;

                if (!string.IsNullOrEmpty(parentLanguage))
                {
                    languageFilter = GetLanguageFilter(parentLanguage);

                    results = ExecuteItemQuery(keywordFilters, languageFilter, maxItems);
                }
            }

            return results?.Edges;
        }

        /// <summary>
        /// Performs the query by PublicContentApi client based on the given filters 
        /// </summary>
        private ItemConnection ExecuteItemQuery(IEnumerable<InputItemFilter> keywordfilters, InputItemFilter languageFilter, int maxItems)
        {
            var customMetaFilters = keywordfilters.ToList();

            customMetaFilters.Add(languageFilter);

            InputItemFilter filter = new InputItemFilter
            {
                NamespaceIds = new List<ContentNamespace> { ContentNamespace.Docs },
                ItemTypes = new List<PublicContentApi.ContentModel.FilterItemType> { PublicContentApi.ContentModel.FilterItemType.PAGE },
                And = customMetaFilters
            };
                                
            var results = _publicContentApi.ExecuteItemQuery(
                filter,
                new InputSortParam { Order = SortOrderType.Descending, SortBy = SortFieldType.LAST_PUBLISH_DATE },
                new Pagination { First = maxItems },
                null,
                ContentIncludeMode.IncludeAndRender,
                includeContainerItems: true,
                contextData: null
                );

            return results;
        }

        /// <summary>
        /// Extracts and returns a collection of topics from the query's results 
        /// </summary>
        private List<Topic> GetDocsTopics(List<ItemEdge> results)
        {
            var topics = new List<Topic>();

            if (results != null)
            {
                foreach (ItemEdge edge in results)
                {
                    Page page = edge.Node as Page;
                    if (page == null)
                    {
                        Log.Debug("Node not is not a Page, skipping.");
                        continue;
                    }

                    int docsPublicationId = (int)edge.Node.PublicationId;
                    ILocalization docsLocalization = new DocsLocalization(docsPublicationId);
                    docsLocalization.EnsureInitialized();

                    // Deserialize Page Content as R2 Data Model
                    string pageModelJson = JsonConvert.SerializeObject(page.RawContent.Data); // TODO: should be able to get string from PCA client
                    PageModelData pageModelData = JsonConvert.DeserializeObject<PageModelData>(pageModelJson, DataModelBinder.SerializerSettings);

                    // Extract the R2 Data Model of the Topic and convert it to a Strongly Typed View Model
                    EntityModelData topicModelData = pageModelData.Regions[0].Entities[0];
                    EntityModel topicModel = ModelBuilderPipeline.CreateEntityModel(topicModelData, null, docsLocalization);

                    Topic topic = topicModel as Topic;
                    if (topic == null)
                    {
                        Log.Warn($"Unexpected View Model type for {topicModel}: '{topicModel.GetType().FullName}'");
                        continue;
                    }

                    // Post-process the Strongly Typed Topic
                    topic.Id = topicModelData.XpmMetadata["ComponentID"] as string;
                    topic.Link = GetFullyQualifiedUrlForTopic(topicModelData.LinkUrl); 

                    topics.Add(topic);
                }
            }

            return topics;
        }

        /// <summary>
        /// Creates and returns a collection of <see cref="InputItemFilter"/> based on the given keyword models
        /// </summary>
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

        /// <summary>
        /// Creates and returns an <see cref="InputItemFilter"/> based on the given language
        /// </summary>
        private static InputItemFilter GetLanguageFilter(string language)
        {
            var languageFilter = new InputItemFilter
            {
                CustomMeta = new InputCustomMetaCriteria
                {
                    Key = "DOC-LANGUAGE.lng.value",
                    Value = language,
                    Scope = CriteriaScope.Publication
                }
            };

            return languageFilter;
        }

        /// <summary>
        /// Extracts and returns the actual keyword's key from the provided field's XML Name 
        /// </summary>
        private static string GetKeywordKey(string keywordFiledXmlName)
        {
            // In schema , a category field is named as this format : SCOPE.KEYWORDNAME.FIELDTYPE 
            // Example : Publication.FMBPRODUCTRELEASENAME.Version  or Item.FMBCONTENTREFTYPE.Logical
            // We need to remove the scope and append ".element" to it (e.g. FMBPRODUCTRELEASENAME.Version.element).

            string scop = keywordFiledXmlName.Split('.')?[0];
            string key = keywordFiledXmlName.Replace(scop + ".", string.Empty);
            return key + ".element";
        }

        /// <summary>
        /// Extracts and returns the keyword filter's scope from the provided field's XML Name 
        /// </summary>
        private static CriteriaScope GetKeywordScope(string keywordFiledXmlName)
        {
            // In schema , a category field is named as this format : SCOPE.KEYWORDNAME.FIELDTYPE  
            // Example : Publication.FMBPRODUCTRELEASENAME.Version  or Item.FMBCONTENTREFTYPE.Logical
            // We need to get the first part (e.g. Item) and returns associated enum value.

            string scope = keywordFiledXmlName.Split('.')?[0];

            switch (scope?.ToLower())
            {
                case "item":
                    return CriteriaScope.Item;
                case "iteminpublication":
                    return CriteriaScope.ItemInPublication;
            }

            return CriteriaScope.Publication;
        }

        /// <summary>
        /// Create and return the topic's url having fully quialified doman name
        /// </summary>
        private static string GetFullyQualifiedUrlForTopic(string url)
        {
            if (!string.IsNullOrEmpty(url))
            {
                Uri uri;

                if (Uri.TryCreate(url, UriKind.Absolute, out uri))
                {
                    url = uri.ToString();
                }
                else
                {
                    if (!url.StartsWith("/"))
                    {
                        url = "/" + url;
                    }

                    var prefixForTopicsUrl = WebRequestContext.Localization.GetConfigValue("tridiondocsmashup.PrefixForTopicsUrl");

                    Uri prefixUri;

                    if (Uri.TryCreate(prefixForTopicsUrl, UriKind.RelativeOrAbsolute, out prefixUri))
                    {
                        if (Uri.TryCreate(prefixUri.ToString().TrimEnd('/') + url, UriKind.Absolute, out uri))
                        {
                            url = uri.ToString();
                        }
                    }
                }
            }

            return url;
        }
    }
}
