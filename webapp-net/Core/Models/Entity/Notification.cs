using Sdl.Web.Common.Models;
using System;
namespace Sdl.Web.Modules.Core.Models
{
    [SemanticEntity(EntityName = "NotificationBar")]
    [Serializable]
    public class Notification : EntityModel
    {
        public string Headline { get; set; }
        public string Text { get; set; }
        public string Continue { get; set; }
        public Link Link { get; set; }
    }
}
