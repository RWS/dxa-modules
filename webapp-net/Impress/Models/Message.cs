using Sdl.Web.Common.Models;
using System;

namespace Sdl.Web.Modules.Impress.Models
{
    [Serializable]
    public class Message : EntityModel
    {
        public RichText Content { get; set; }
    }
}
