using System.Collections.Generic;
using Sdl.Web.Common.Models;
using Sdl.Web.Modules.Ugc.Data;

namespace Sdl.Web.Modules.Ugc.Models
{
    [SemanticEntity("UgcCommentList")]
    public class UgcCommentList : EntityModel
    {       
        [SemanticProperty("headline")]
        public string Headline { get; set; }

        public List<Comment> Comments { get; set; }      
    }
}
