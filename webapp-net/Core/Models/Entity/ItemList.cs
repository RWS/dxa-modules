using Sdl.Web.Common.Models;
using System.Collections.Generic;
using System.ServiceModel.Syndication;
using System;
using Sdl.Web.Common.Configuration;

namespace Sdl.Web.Modules.Core.Models
{
    [SemanticEntity(Vocab = SchemaOrgVocabulary, EntityName = "ItemList", Prefix = "s", Public = true)]
    [Serializable]
    public class ItemList : EntityModel, ISyndicationFeedItemProvider
    {
        [SemanticProperty("s:headline")]
        public string Headline { get; set; }
        [SemanticProperty("s:itemListElement")]
        public List<Teaser> ItemListElements { get; set; }

        #region ISyndicationFeedItemProvider members
        /// <summary>
        /// Extracts syndication feed items.
        /// </summary>
        /// <param name="localization">The context <see cref="Localization"/>.</param>
        /// <returns>The extracted syndication feed items; a concatentation of syndication feed items provided by <see cref="QueryResults"/> (if any).</returns>
        public virtual IEnumerable<SyndicationItem> ExtractSyndicationFeedItems(Localization localization)
        {
            return ConcatenateSyndicationFeedItems(ItemListElements, localization);
        }
        #endregion
    }
}
