using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using Sdl.Web.Common.Models;
using System;

namespace Sdl.Web.Modules.Search.Models
{
    /// <summary>
    /// Abstract base class for Search Query/Results.
    /// </summary>
    [SemanticEntity(Vocab = "http://schema.org", EntityName = "ItemList", Prefix = "s", Public = true)]
    [SemanticDefaults(MapAllProperties = false)]
    [Serializable]
    public abstract class SearchQuery : EntityModel
    {
        // Below properties are mapped to fields of the CMS "Search Query" Component.

        /// <summary>
        /// The headline to show above the search results (optional)
        /// </summary>
        [SemanticProperty("headline")]
        [SemanticProperty("s:headline")]
        public string Headline { get; set; }

        /// <summary>
        /// The text to show above the search results if there were hits.
        /// </summary>
        [SemanticProperty("resultsText")]
        public string ResultsText { get; set; }

        /// <summary>
        /// The text to show if there were no hits.
        /// </summary>
        [SemanticProperty("noResultsText")]
        public string NoResultsText { get; set; }

        /// <summary>
        /// The number of items to show per result page.
        /// </summary>
        [SemanticProperty("pageSize")]
        public int PageSize { get; set; }

        /// <summary>
        /// The (qualified) name of the View used to render the search result entities.
        /// </summary>
        [SemanticProperty("searchItemView")]
        public string SearchItemView { get; set; }


        // Below properties are mapped (by the Search Controller) to query string parameters
        public string QueryText { get; set; }
        public int Start { get; set; }
        public NameValueCollection QueryStringParameters { get; set; }

        // Below properties reflect the search results (set by the Search Provider)
        public int CurrentPage { get; set; }
        public int Total { get; set; }
        public bool HasMore { get; set; }

        [SemanticProperty("s:itemListElement")]
        [SemanticProperty(IgnoreMapping = true)]
        public IList<SearchItem> Results { get; private set; }

        /// <summary>
        /// Constructor
        /// </summary>
        protected SearchQuery()
        {
            Results = new List<SearchItem>();

            // Default values used in case this is not configured in CMS.
            SearchItemView = "Search:SearchItem";
            PageSize = 10;
        }

        /// <summary>
        /// Creates a deep copy of this View Model.
        /// </summary>
        /// <returns>The copied View Model.</returns>
        public override ViewModel DeepCopy()
        {
            SearchQuery clone = (SearchQuery) base.DeepCopy();
            if (QueryStringParameters != null)
            {
                clone.QueryStringParameters = new NameValueCollection(QueryStringParameters);
            }
            clone.Results = new List<SearchItem>(Results);
            return clone;
        }
    }

    /// <summary>
    /// Represents a Search Query with strongly typed results.
    /// </summary>
    /// <typeparam name="TResult">The type of the <see cref="Results"/> (must be a subclass of <see cref="SearchItem"/>).</typeparam>
    [Serializable]
    public class SearchQuery<TResult> : SearchQuery 
        where TResult : SearchItem
    {
        [SemanticProperty("s:itemListElement")]
        [SemanticProperty(IgnoreMapping = true)]
        public new IList<TResult> Results
        {
            get
            {
                return base.Results.Cast<TResult>().ToList();
            }
        }
    }
}
