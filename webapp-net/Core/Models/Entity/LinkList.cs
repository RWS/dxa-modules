using Sdl.Web.Common.Models;
using System;
using System.Collections.Generic;

namespace Sdl.Web.Modules.Core.Models
{
    [SemanticEntity(EntityName = "SocialLinks", Prefix = "s")]
    [Serializable]
    public class LinkList<T> : EntityModel
    {
        [SemanticProperty("headline")]
        [SemanticProperty("s:headline")]
        public string Headline { get; set; }

        [SemanticProperty("link")]
        [SemanticProperty("s:link")]
        public List<T> Links { get; set; }

        public LinkList()
        {
            Links = new List<T>();
        }
    }
}
