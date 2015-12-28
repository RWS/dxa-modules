using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Test.Models
{
    [SemanticEntity(Vocab = CoreVocabulary, EntityName = "TestFlickrImageModel", Prefix = "test", Public = true)]
    public class TestFlickrImageModel : EclItem
    {
        [SemanticProperty("test:testProp1")]
        public string TestProperty1
        {
            get;
            set;
        }
    }
}
