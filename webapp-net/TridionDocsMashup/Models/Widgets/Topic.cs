using System.Collections.Generic;
using Sdl.Web.Common.Models;
using Sdl.Web.Common.Interfaces;

namespace Sdl.Web.Modules.TridionDocsMashup.Models.Widgets
{

    [SemanticEntity(Vocab = DitaVocabulary, EntityName = "body")]
    public class Topic : EntityModel
    {
        [SemanticProperty("title")]
        public string Title { get; set; }

        [SemanticProperty("body")]
        public RichText Body { get; set; }

        [SemanticProperty("nested1")]
        [SemanticProperty("nested2")]
        public List<Topic> NestedTopics { get; set; }

        [SemanticProperty(IgnoreMapping = true)]
        public string Link { get; set; }

        public override MvcData GetDefaultView(ILocalization localization)
        {
            return new MvcData("TridionDocsMashup:Entity:Topic");
        }
    }

}
