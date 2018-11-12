using System.Collections.Generic;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.TridionDocsMashup.Models.Widgets
{
    [SemanticEntity(Vocab = DitaVocabulary, EntityName = "title")]
    public class Topic : EntityModel
    {
        [SemanticProperty("title")]
        public RichText Title { get; set; }
        
        [SemanticProperty("body")]
        public RichText Body { get; set; }

        [SemanticProperty("nested1")]
        [SemanticProperty("nested2")]
        public List<Topic> NestedTopics { get; set; }

        [SemanticProperty(IgnoreMapping = true)]
        public string Link { get; set; }

        public override MvcData GetDefaultView(Localization localization)
        {
            return new MvcData("TridionDocsMashup:Entity:Topic");
        }
    }

}
