using System.Collections.Generic;
using Sdl.Tridion.Api.IqQuery;

namespace Sdl.Web.Modules.Search.Data
{
    public class IqSearchResultSet : IQueryResultData<IqSearchResult>
    {
        public int Hits { get; set; }

        public int Count { get; set; }

        public int StartIndex { get; set; }

        public IList<IqSearchResult> QueryResults { get; set; }
    }

    public class IqSearchResultSetWrapped : IQueryResultData<IqSearchResultWrapped>
    {
        private readonly List<IqSearchResultWrapped> _results;
        public IqSearchResultSetWrapped(IqSearchResultSet searchResultSet)
        {
            _results = new List<IqSearchResultWrapped>();
            foreach (var x in searchResultSet.QueryResults)
            {
                _results.Add(new IqSearchResultWrapped(x));
            }
        }

        public int Hits { get; set; }
        public int Count { get; set; }
        public int StartIndex { get; set; }

        public IList<IqSearchResultWrapped> QueryResults
        {
            get { return _results; }
            set { }
        }
    }
}
