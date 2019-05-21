using System.Collections.Generic;
using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Test.Models
{
    public class CompLinkTest2 : EntityModel
    {
        [SemanticProperty("compLink")]
        public List<Link> CompLink { get; set; }
    }
}
