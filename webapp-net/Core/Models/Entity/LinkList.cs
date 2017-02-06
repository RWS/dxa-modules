using Sdl.Web.Common.Models;
using System;
using System.Collections.Generic;

namespace Sdl.Web.Modules.Core.Models
{
    [SemanticEntity(EntityName = "SocialLinks")]
    [Serializable]
    public class LinkList<T> : EntityModel
    {
        public string Headline { get; set; }
        public List<T> Links { get; set; }
        public LinkList()
        {
            Links = new List<T>();
        }
    }
}
