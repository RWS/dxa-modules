using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Test.Models
{
    [SemanticEntity(Vocab = CoreVocabulary, EntityName = "TestEclEntityModel", Prefix = "test", Public = true)]
    public class TestEclEntityModel : EclItem
    {
        [SemanticProperty("test:testProp1")]
        public string TestProperty1
        {
            get;
            set;
        }
    }
}
