using Sdl.Web.Common.Models;
using System;
using System.Collections.Generic;
using System.ServiceModel.Syndication;
using Sdl.Web.Common.Configuration;

namespace Sdl.Web.Modules.Core.Models
{
    [SemanticEntity(EntityName = "Teaser", Prefix = "t", Vocab = CoreVocabulary)]
    [SemanticEntity(EntityName = "Image", Prefix = "i", Vocab = CoreVocabulary)]
    [SemanticEntity(EntityName = "Article", Prefix = "s", Vocab = CoreVocabulary)]
    [SemanticEntity(EntityName = "NewsArticle", Prefix = "tri", Vocab = CoreVocabulary)]
    [SemanticEntity(EntityName = "Place", Prefix = "p", Vocab = CoreVocabulary)]
    public class Teaser : EntityModel, ISyndicationFeedItemProvider
    {
        //A teaser can be mapped from an article or place, in which case the link should be to the item itself
        [SemanticProperty("tri:_self")]
        [SemanticProperty("s:_self")]
        [SemanticProperty("p:_self")]
        public Link Link { get; set; } // TODO: add resolve link code on first retrieval
        
        [SemanticProperty("tri:name")]
        [SemanticProperty("s:name")]
        [SemanticProperty("headline")]
        [SemanticProperty("subheading")]
        [SemanticProperty("p:name")]
        public string Headline { get; set; }
        
        //A teaser can be mapped from an individual image, in which case the image property is set from the source entity itself
        [SemanticProperty("i:_self")]
        [SemanticProperty("s:image")]
        [SemanticProperty("tri:image")]
        public MediaItem Media { get; set; }

        [SemanticProperty("tri:introText")]
        [SemanticProperty("s:introText")]
        [SemanticProperty("content")]
        public RichText Text { get; set; }

        [SemanticProperty("dateCreated")]
        public DateTime? Date { get; set; }

        public Location Location { get; set; }

        //To store formatting options for the teaser (link style etc.)
        [SemanticProperty(IgnoreMapping=true)]
        private Dictionary<string, string> FormatOptions { get; set; }

        public string GetFormatOption(string key, string defaultValue = null)
        {
            if (FormatOptions != null && FormatOptions.ContainsKey(key))
            {
                return FormatOptions[key];
            }

            return defaultValue;
        }

        public void SetFormatOption(string key, string value)
        {
            if (FormatOptions == null)
            {
                FormatOptions = new Dictionary<string, string>();
            }
            if (!FormatOptions.ContainsKey(key))
            {
                FormatOptions.Add(key, value);
            }
            else
            {
                FormatOptions[key] = value;
            }
        }

        #region ISyndicationFeedItemProvider members
        /// <summary>
        /// Extracts syndication feed items.
        /// </summary>
        /// <param name="localization">The context <see cref="Localization"/>.</param>
        /// <returns>A single syndication feed item containing information extracted from this <see cref="Teaser"/>.</returns>
        public IEnumerable<SyndicationItem> ExtractSyndicationFeedItems(Localization localization)
        {
            return new[] { CreateSyndicationItem(Headline, Text, Link, Date, localization) };
        }
        #endregion
    }
}