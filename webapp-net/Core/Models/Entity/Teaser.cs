using Sdl.Web.Common.Models;
using System;
using System.Collections.Generic;

namespace Sdl.Web.Modules.Core.Models
{
    [SemanticEntity(EntityName = "Teaser", Prefix = "t", Vocab = CoreVocabulary)]
    [SemanticEntity(EntityName = "Image", Prefix = "i", Vocab = CoreVocabulary)]
    [SemanticEntity(EntityName = "Article", Prefix = "s", Vocab = CoreVocabulary)]
    [SemanticEntity(EntityName = "NewsArticle", Prefix = "tri", Vocab = CoreVocabulary)]
    [SemanticEntity(EntityName = "Place", Prefix = "p", Vocab = CoreVocabulary)]
    public class Teaser : EntityModel
    {
        //A teaser can be mapped from an article or place, in which case the link should be to the item itself
        [SemanticProperty("tri:_self")]
        [SemanticProperty("s:_self")]
        [SemanticProperty("p:_self")]
        public Link Link { get; set; } // TODO: add resolve link code on first retrieval
        
        [SemanticProperty("tri:name")]
        [SemanticProperty("headline")]
        [SemanticProperty("subheading")]
        public string Headline { get; set; }
        
        //A teaser can be mapped from an individual image, in which case the image property is set from the source entity itself
        [SemanticProperty("i:_self")]
        [SemanticProperty("a:image")]
        public MediaItem Media { get; set; }

        [SemanticProperty("tri:introText")]
        [SemanticProperty("s:introText")]
        public RichText Text { get; set; }

        [SemanticProperty("dateCreated")]
        [SemanticProperty("_self")]
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
    }
}