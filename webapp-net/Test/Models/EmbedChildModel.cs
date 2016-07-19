using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Test.Models
{
    [SemanticEntity(Vocab = CoreVocabulary, EntityName = "EmbedChild", Prefix = "test", Public = true)]
    public class EmbedChildModel : EntityModel
    {
        [SemanticProperty("test:Description")]
        public string Description
        {
            get;
            set;
        }
    }
}
