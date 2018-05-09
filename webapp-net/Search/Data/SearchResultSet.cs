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
}
