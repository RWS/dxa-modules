using Sdl.Web.Common.Models;
using System;
using System.Collections.Generic;
using System.ServiceModel.Syndication;
using Sdl.Web.Common.Configuration;

namespace Sdl.Web.Modules.Core.Models
{
    [SemanticEntity(EntityName = "Teaser", Prefix = "t", Vocab = CoreVocabulary)]
    [SemanticEntity(EntityName = "Image", Prefix = "i", Vocab = CoreVocabulary)]
    [SemanticEntity(EntityName = "Article", Prefix = "a", Vocab = CoreVocabulary)]
    [SemanticEntity(EntityName = "NewsArticle", Prefix = "na", Vocab = CoreVocabulary)]
    [SemanticEntity(EntityName = "Place", Prefix = "p", Vocab = CoreVocabulary)]
    [SemanticEntity(EntityName = "StandardMetadata", Prefix = "m", Vocab = CoreVocabulary)]
    [SemanticEntity(EntityName = "LinkedContent", Prefix = "c", Vocab = CoreVocabulary)]
    [Serializable]
    public class Teaser : EntityModel, ISyndicationFeedItemProvider
    {
        //A teaser can be mapped from an article or place, in which case the link should be to the item itself
        [SemanticProperty("na:_self")]
        [SemanticProperty("a:_self")]
        [SemanticProperty("p:_self")]
        [SemanticProperty("c:link")]

        public Link Link { get; set; }
        
        [SemanticProperty("na:name")]
        [SemanticProperty("a:name")]
        [SemanticProperty("headline")]
        [SemanticProperty("t:headline")]
        [SemanticProperty("a:headline")]
        [SemanticProperty("subheading")]
        [SemanticProperty("p:name")]
        [SemanticProperty("c:subheading")]
        public string Headline { get; set; }
        
        //A teaser can be mapped from an individual image, in which case the image property is set from the source entity itself
        [SemanticProperty("i:_self")]
        [SemanticProperty("a:image")]
        [SemanticProperty("na:image")]
        [SemanticProperty("c:media")]
        public MediaItem Media { get; set; }

        [SemanticProperty("na:introText")]
        [SemanticProperty("a:introText")]
        [SemanticProperty("content")]
        [SemanticProperty("description")]
        [SemanticProperty("m:description")]
        [SemanticProperty("c:content")]
        public RichText Text { get; set; }

        [SemanticProperty("dateCreated")]
        [SemanticProperty("m:dateCreated")]
        [SemanticProperty("c:date")]
        public DateTime? Date { get; set; }

        [SemanticProperty("p:location")]
        [SemanticProperty("c:location")]
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
            Link link = Link;
            if (link == null && Media != null)
            {
                // If the Teaser doesn't have a Link, but does have Media, create a Link from its Media.
                link = new Link { Url = Media.Url };
            }
            return new[] { CreateSyndicationItem(Headline, Text, link, Date, localization) };
        }
        #endregion
    }
}