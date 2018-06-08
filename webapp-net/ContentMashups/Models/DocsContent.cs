using Sdl.Web.Common.Models;
using System;
namespace Sdl.Web.Modules.ContentMashups.Models
{
    [Serializable]
    [SemanticEntity(EntityName = "Content")]
    public class DocsContent : EntityModel
    {
        [SemanticProperty("ProductReleaseName")]
        public KeywordModel ProductRelease { get; set; }

        [SemanticProperty("ProductFamilyName")]
        public KeywordModel ProductFamily { get; set; }

        [SemanticProperty("ContentType")]
        public KeywordModel ContentType { get; set; }

        [SemanticProperty("EmbeddedContent")]
        public string EmbeddedContent { get; set; }

        [SemanticProperty("Link")]
        public string Link { get; set; }

        public string Query { get; set; }
    }
}