using System.Collections.Generic;
using Newtonsoft.Json;
using Sdl.Web.Delivery.IQQuery.API;

namespace Sdl.Web.Modules.Search.Data
{
    public class SearchResult : IQueryResult
    {
        public string Id { get; set; }

        [JsonProperty(PropertyName = "meta")]
        public Dictionary<string, object> Fields { get; set; }

        public string Locale { get; set; } = "en";

        public Dictionary<string, List<string>> Highlighted { get; set; }

        public string Content { get; set; }

        public string CreatedDate { get; set; }

        public string ModifiedDate { get; set; }

        public int PublicationId { get; set; }

        public string PublicationTitle { get; set; }

        public string ProductFamilyName { get; set; }

        public string ProductReleaseName { get; set; }
    }

}
