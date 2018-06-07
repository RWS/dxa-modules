using Sdl.Web.Common.Models;
using System;
namespace Sdl.Web.Modules.ContentMashups.Models
{
    [Serializable]
    [SemanticEntity(EntityName = "Content")]
    public class DocsContent : EntityModel
    {
        [SemanticProperty("ReleaseName")]
        public string ReleaseName { get; set; }

        [SemanticProperty("FamilyName")]
        public string FamilyName { get; set; }

        [SemanticProperty("ContentType")]
        public string ContentType { get; set; }

        [SemanticProperty("EmbeddedContent")]
        public string EmbeddedContent { get; set; }

        [SemanticProperty("Link")]
        public string Link { get; set; }
    }
}