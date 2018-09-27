using System;
using Newtonsoft.Json;
using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.DynamicDocumentation.Models
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
