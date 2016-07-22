using Sdl.Web.Common.Models;
namespace Sdl.Web.Modules.Core.Models
{
    [SemanticEntity(EntityName = "NotificationBar", Prefix = "nb", Vocab = CoreVocabulary)]
    public class Notification : EntityModel
    {
        public string Headline { get; set; }
        public string Text { get; set; }
        public string Continue { get; set; }
        public Sdl.Web.Common.Models.Link Link { get; set; }
    }
}
