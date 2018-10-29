using System.Collections.Generic;
using Sdl.Tridion.Api.IqQuery;

namespace Sdl.Web.Modules.Search.Data
{
    public class SearchResult : IQueryResult
    {
        public string Id { get; set; }

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

    public class SearchResultWrapped : IQueryResult
    {
        private readonly SearchResult _wrapped;

        public SearchResultWrapped(SearchResult searchResult)
        {
            _wrapped = searchResult;
        }

        public string Id => _wrapped.Id;

        public Dictionary<string, object> Meta => _wrapped.Fields;

        public string Locale => _wrapped.Locale;

        public Dictionary<string, List<string>> Highlighted => _wrapped.Highlighted;

        public string Content => _wrapped.Content;

        public string CreatedDate => _wrapped.CreatedDate;

        public string ModifiedDate => _wrapped.ModifiedDate;

        public int PublicationId => _wrapped.PublicationId;

        public string PublicationTitle => _wrapped.PublicationTitle;

        public string ProductFamilyName => _wrapped.ProductFamilyName;

        public string ProductReleaseName => _wrapped.ProductFamilyName;
    }
}
