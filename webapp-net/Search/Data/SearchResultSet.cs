using System.Collections.Generic;
using Sdl.Web.Delivery.IQQuery.API;

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
        private readonly SearchResultSet _searchResultSet;
        private readonly List<SearchResultWrapped> _results;
        public SearchResultSetWrapped(SearchResultSet searchResultSet)
        {
            _searchResultSet = searchResultSet;
            _results = new List<SearchResultWrapped>();
            foreach (var x in _searchResultSet.QueryResults)
            {
                _results.Add(new SearchResultWrapped(x));
            }
        }

        public int Hits
        {
            get { return _searchResultSet.Hits; }
            set { }
        }

        public int Count
        {
            get { return _searchResultSet.Count; }
            set { }
        }

        public int StartIndex
        {
            get { return _searchResultSet.StartIndex; }
            set { }
        }
        public IList<SearchResultWrapped> QueryResults
        {
            get { return _results; }
            set { }
        }
    }
}
