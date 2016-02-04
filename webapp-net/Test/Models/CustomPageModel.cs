using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Test.Models
{
    [SemanticEntity(Vocab = CoreVocabulary, EntityName = "CustomPageTest", Prefix = "test")]
    public class CustomPageModel : PageModel
    {
        public CustomPageModel(string id)
                : base(id)
        {
        }

        [SemanticProperty("test:testProp1")]
        public string TestProperty1
        {
            get;
            set;
        }

        // TODO: Currently not allowed: [SemanticProperty("test:testProp2")]
        public string TestField1;
    }
}
