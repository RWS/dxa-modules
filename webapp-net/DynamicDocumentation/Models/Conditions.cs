using System.Collections.Generic;

namespace Sdl.Web.Modules.DynamicDocumentation.Models
{   
    public class Conditions
    {
        public int PublicationId { get; set; }
        public Dictionary<string, object> UserConditions { get; set; }       
    }
}
