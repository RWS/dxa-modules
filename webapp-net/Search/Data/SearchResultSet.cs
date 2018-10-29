using System.Collections.Generic;
using Sdl.Tridion.Api.IqQuery;

namespace Sdl.Web.Modules.Search.Data
{
    public class SearchResultSet : IQueryResultData<SearchResult>
    {
        public int Hits { get; set; }

        public int Count { get; set; }

        public int StartIndex { get; set; }

        public IList<SearchResult> QueryResults { get; set; }
    }

    public class SearchResultSetWrapped : IQueryResultData<SearchResultWrapped>
    {
        private readonly List<SearchResultWrapped> _results;
        public SearchResultSetWrapped(SearchResultSet searchResultSet)
        {
            _results = new List<SearchResultWrapped>();
            foreach (var x in searchResultSet.QueryResults)
            {
                _results.Add(new SearchResultWrapped(x));
            }
        }

        public int Hits { get; set; }
        public int Count { get; set; }
        public int StartIndex { get; set; }

        public IList<SearchResultWrapped> QueryResults
        {
            get { return _results; }
            set { }
        }
    }
}
