using System.Collections.Generic;

namespace Sdl.Web.Modules.Search.Data
{
    public class SearchResultSet
    {
        public int Hits { get; set; }

        public int Count { get; set; }

        public int StartIndex { get; set; }

        public IList<SearchResult> QueryResults { get; set; }
    }   
}
