using System;
using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Test.Models
{
    [SemanticEntity(EntityName = "CachingAttributeTest", Prefix = "test", Public = true)]
    public class CachingEntityModel : EntityModel
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
    }
}
