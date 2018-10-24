using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.TridionDocsMashup.Models.Widgets
{

    [SemanticEntity(Vocab = DitaVocabulary, EntityName = "body")]
    public class Topic : EntityModel
    {
        [SemanticProperty("title")]
        public string Title { get; set; }

        [SemanticProperty("body")]
        public RichText Body { get; set; }

        [SemanticProperty(IgnoreMapping = true)]
        public string Link { get; set; }
    }

}
