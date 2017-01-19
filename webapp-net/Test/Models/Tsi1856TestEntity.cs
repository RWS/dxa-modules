using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Test.Models
{
    [SemanticEntity(Vocab = CoreVocabulary, EntityName = "TSI1856", Prefix = "test", Public = true)]
    [SemanticEntity(Vocab = CoreVocabulary, EntityName = "TSI1856EmbedMeta", Prefix = "m", Public = true)]
    public class Tsi1856TestEntity : EntityModel
    {
        [SemanticProperty("test:title")]
        public string TitleComponent
        {
            get;
            set;
        }

        [SemanticProperty("m:title")]
        public string TitleMeta
        {
            get;
            set;
        }
    }
}
