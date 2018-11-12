using Sdl.Web.Common.Models;
using System;
using System.Collections.Generic;
using System.ServiceModel.Syndication;
using Sdl.Web.Common.Configuration;

namespace Sdl.Web.Modules.Core.Models
{
    [SemanticEntity(Vocab = SchemaOrgVocabulary, EntityName= "Article", Prefix= "s", Public=true)]
    [Serializable]
    public class Article : EntityModel, ISyndicationFeedItemProvider
    {
        [SemanticProperty("s:headline")]
        public string Headline { get; set; }
        [SemanticProperty("s:image")]
        public Image Image { get; set; }        
        [SemanticProperty("s:dateCreated")]
        public DateTime? Date { get; set; }
        [SemanticProperty("s:about")]
        public string Description { get; set; }
        [SemanticProperty("s:articleBody")]
        public List<Paragraph> ArticleBody { get; set; }

        #region ISyndicationFeedItemProvider members
        /// <summary>
        /// Extracts syndication feed items.
        /// </summary>
        /// <param name="localization">The context <see cref="Localization"/>.</param>
        /// <returns>A single syndication feed item containing information extracted from this <see cref="Article"/>.</returns>
        public IEnumerable<SyndicationItem> ExtractSyndicationFeedItems(Localization localization)
        {
            return new[] { CreateSyndicationItem(Headline, Description, null, Date, localization) };
        }
        #endregion

    }
}