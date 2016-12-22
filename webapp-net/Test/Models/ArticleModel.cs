using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Test.Models
{
    [SemanticEntity(Vocab = CoreVocabulary, EntityName = "Article", Prefix = "test", Public = true)]
    public class ArticleModel : EntityModel
    {
        [SemanticProperty("test:heading")]
        public string Heading
        {
            get;
            set;
        }

        [SemanticProperty("test:content")]
        public RichText Content
        {
            get;
            set;
        }

        [SemanticProperty("test:sideArticle")]
        public ArticleModel SideArticle
        {
            get;
            set;
        }
    }
}
