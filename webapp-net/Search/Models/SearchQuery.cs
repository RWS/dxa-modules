using System.Collections.Generic;
using System.Linq;
using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Search.Models
{
    public abstract class SearchQuery : EntityModel
    {
        //Content from CMS
        [SemanticProperty("s:headline")]
        public string Headline { get; set; }

        //Content from CMS
        public string SearchItemView { get; set; }

        //Content from CMS, this way the fields are XPM enabled.
        public string ResultsText { get; set; }

        //Content from CMS, this way the fields are XPM enabled.
        public string NoResultsText { get; set; }

        //Webrequest queryText
        public string QueryText { get; set; }

        public int CurrentPage { get; set; }

        //Content from CMS
        public int PageSize { get; set; }

        public int Start { get; set; }

        public int Total { get; set; }

        public bool HasMore { get; set; }

        public IList<SearchItem> SearchItems { get; private set; }


        protected SearchQuery()
        {
            CurrentPage = 1;
            PageSize = 0;
            SearchItems = new List<SearchItem>();
            SearchItemView = "Search:SearchItem";
        }
    }


    [SemanticEntity(Vocab = "http://schema.org", EntityName = "ItemList", Prefix = "s", Public = true)]
    public class SearchQuery<T> : SearchQuery where T : SearchItem
    {
        [SemanticProperty("s:itemListElement")]
        public new IList<T> SearchItems
        {
            get
            {
                return base.SearchItems.Cast<T>().ToList();
            }
        }

    }
}
