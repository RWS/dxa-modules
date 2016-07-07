using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Test.Models
{
    [SemanticEntity(Vocab = CoreVocabulary, EntityName = "EmbedParent", Prefix = "test", Public = true)]
    public class EmbedParentModel : EntityModel
    {
        [SemanticProperty("test:Title")]
        public string Title
        {
            get;
            set;
        }

        [SemanticProperty("test:EmbeddedEntity")]
        public EmbedChildModel EmbeddedEntity
        {
            get;
            set;
        }
    }
}
