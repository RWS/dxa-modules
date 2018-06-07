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

        [SemanticProperty("ContnetType")]
        public string ContnetType { get; set; }

        [SemanticProperty("EmbeddedContnet")]
        public string EmbeddedContnet { get; set; }

        [SemanticProperty("Link")]
        public string Link { get; set; }
    }
}