using System.Collections.Generic;
using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Ish.Models
{
    public class PublicationSiteMap : EntityModel
    {
        public int PublicationId { get; set; }

        public int NamespaceId { get; set; }

        public List<SiteMapUrlEntry> Urls { get; set; } = new List<SiteMapUrlEntry>();
    }
}
