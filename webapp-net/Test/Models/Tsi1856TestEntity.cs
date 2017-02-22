using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Test.Models
{
    [SemanticEntity("TSI1856")]
    [SemanticEntity(Vocab = "uuid:d4473ba5-05e0-4320-bfd6-6fbb9eb6265e", EntityName = "TSI1856", Prefix = "test-r")]
    [SemanticEntity(Vocab = CoreVocabulary, EntityName = "TSI1856EmbedMeta", Prefix = "m")]
    public class Tsi1856TestEntity : EntityModel
    {
        [SemanticProperty("title")]
        [SemanticProperty("test-r:title")]
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
