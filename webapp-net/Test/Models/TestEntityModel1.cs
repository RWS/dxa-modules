using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Test.Models
{
    [SemanticEntity(Vocab = CoreVocabulary, EntityName = "TestEntity1", Prefix = "test", Public = true)]
    public class TestEntityModel1 : EntityModel
    {
        [SemanticProperty("test:testProp1")]
        public string TestProperty1
        {
            get;
            set;
        }

        [SemanticProperty("test:testProp2")]
        public TestEntityModel2 TestProperty2
        {
            get;
            set;
        }
    }
}
