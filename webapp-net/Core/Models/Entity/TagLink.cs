using Sdl.Web.Common.Models;
using System;
namespace Sdl.Web.Modules.Core.Models
{
    [SemanticEntity(EntityName = "SocialLink")]
    [Serializable]
    public class TagLink : EntityModel
    {
        [SemanticProperty("internalLink")]
        [SemanticProperty("externalLink")]
        public string Url { get; set; }
        public Tag Tag { get; set; }
    }
}
