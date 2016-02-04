using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Test.Models
{
    [SemanticEntity(Vocab = CoreVocabulary, EntityName = "TestEntityWithEclLink", Prefix = "test", Public = true)]
    public class TestEntityWithEclLink : EntityModel
    {
        [SemanticProperty("EclLink")]
        public EclItem EclLink
        {
            get;
            set;
        }
    }
}
