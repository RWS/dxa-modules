using Sdl.Tridion.Api.Client;
using System.Collections;

namespace Sdl.Web.Modules.Search.Data
{
    public class SearchResult
    {
        public string Id { get; set; }

        public string Content { get; set; }

        public string Language { get; set; } = "en";

        public string ProductFamilyTitle { get; set; }

        public string ProductReleaseVersionTitle { get; set; }

        public int PublicationId { get; set; }

        public string PublicationTitle { get; set; }

        public string PageId { get; set; }

        public string PageTitle { get; set; }

        public string LastModifiedDate { get; set; }

        public ItemType ItemType { get; set; }

        public IDictionary Meta { get; set; }

        public IDictionary Highlighted { get; set; }

        public string SchemaId { get; set; }

        public string Url { get; set; }
    }
}
