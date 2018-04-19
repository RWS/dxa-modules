using Sdl.Web.Common.Models;
using Sdl.Web.Modules.Ugc.Data;
using System.Collections.Generic;

namespace Sdl.Web.Modules.Ugc.Models
{
    public class UgcComment : EntityModel
    {
        public Comment CommentData { get; set; }

        public List<UgcComment> Comments { get; set; }
    }
}
