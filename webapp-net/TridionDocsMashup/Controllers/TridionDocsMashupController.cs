using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Sdl.Web.Mvc.Formats;
using System;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Models;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Mvc.Controllers;
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

            if (staticWidget?.Keywords != null)
            {
                PublicContentApiClient pcaClient = new PublicContentApiClient();

                staticWidget.Topics = pcaClient.GetTridionDocsTopicsByKeywords(staticWidget.Keywords, staticWidget.MaxItems);
            }

            DynamicWidget dynamicWidget = base.EnrichModel(sourceModel) as DynamicWidget;

            if (dynamicWidget?.Keywords != null)
            {
                PublicContentApiClient pcaClient = new PublicContentApiClient();

                // There are multiple regions in a page. 
                // Each region contains entities and every entity has a view.
                // We are looking for a product entity by its view name which is specified in the dynamicWidget.ProductViewModel .

                foreach (RegionModel regionModel in WebRequestContext.PageModel.Regions)
                {
                    Product product = regionModel.Entities?.FirstOrDefault(e => e.MvcData.ViewName == dynamicWidget.ProductViewModel) as Product;

                    if (product?.Keywords == null) continue;
                    // When the product entity is found, we get its keywords.
                    // But we only collect those keywords specified in the dynamicWidget.Keywords .
                    // Then we are ready to get TridionDocs topics by the keywords values .

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

            return sourceModel;
        }

        [Route("~/docsmashup/binary/{publicationId:int}/{binaryId:int}/{*content}")]
        [FormatData]
        public virtual ActionResult Binary(int publicationId, int binaryId, params string[] rest)
        {
            try
            {
                var docsLocalization = new DocsLocalization(publicationId);
                StaticContentItem content = ContentProviderExt.GetStaticContentItem(binaryId, docsLocalization);
                return new FileStreamResult(content.GetContentStream(), content.ContentType);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [Route("~/docsmashup/binary/{publicationId:int}/{binaryId}/{*content}")]
        [FormatData]
        public virtual ActionResult Binary(string publicationId, string binaryId) => ServerError(null, 400);

        public ActionResult ServerError(Exception ex, int statusCode = 404)
        {
            Response.StatusCode = statusCode;
            if (ex == null) return new EmptyResult();
            if (ex.InnerException != null) ex = ex.InnerException;
            return Content("{ \"Message\": \"" + ex.Message + "\" }", "application/json");
        }

        private IContentProviderExt ContentProviderExt => (IContentProviderExt)ContentProvider;
    }
}

