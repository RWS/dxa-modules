using Sdl.Web.Common.Models;
using System;
namespace Sdl.Web.Modules.Core.Models
{
    [Serializable]
    public class Paragraph : EntityModel
    {
        public string Subheading { get; set; }
        public RichText Content { get; set; }
        public MediaItem Media { get; set; }
        public string Caption { get; set; }
    }
}