using System.Collections.Generic;
using Sdl.Web.Common.Models;
using Sdl.Web.Modules.Ugc.Data;
using Sdl.Web.Tridion.ContentManager;

namespace Sdl.Web.Modules.Ugc.Models
{
    public class UgcComments : EntityModel
    {
        [SemanticProperty(IgnoreMapping = true)]
        public CmUri Target { get; set; }

        [SemanticProperty(IgnoreMapping = true)]
        public List<UgcComment> Comments { get; set; }
    }
}
