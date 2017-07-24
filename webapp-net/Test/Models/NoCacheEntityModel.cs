using System;
using Sdl.Web.Common;
using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Test.Models
{
    [DxaNoCache]
    [DxaNoOutputCache]
    [SemanticEntity(EntityName = "NoCachePropertyTest", Prefix = "test", Public = true)]
    public class NoCacheEntityModel : EntityModel
    {
        [SemanticProperty("test:textField")]
        public string Text
        {
            get;
            set;
        }

        [SemanticProperty("test:numberField")]
        public int Number
        {
            get;
            set;
        }

        [SemanticProperty("test:dateField")]
        public DateTime Date
        {
            get;
            set;
        }

        public String DateNow = DateTime.Now.ToString("MM/dd/yy HH:mm:ss");
    }
}
