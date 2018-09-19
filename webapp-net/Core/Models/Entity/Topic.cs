using Sdl.Web.Common.Models;
using System;
using Newtonsoft.Json;

namespace Sdl.Web.Modules.Core.Models
{
    /// <summary>
    /// Topic Entity
    /// </summary>
    [SemanticEntity(Vocab = SchemaOrgVocabulary, EntityName = "Topic", Prefix = "s", Public = true)]
    [Serializable]
    public class Topic : EntityModel
    {
        [SemanticProperty("topicBody")]
        [JsonProperty(PropertyName = "topicBody")]
        public RichText TopicBody { get; set; }

        [SemanticProperty("topicTitle")]
        [JsonProperty(PropertyName = "topicTitle")]
        public string TopicTitle { get; set; }
    }
}