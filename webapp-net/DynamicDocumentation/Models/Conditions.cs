using System.Collections.Generic;
using System.Linq;
using Sdl.Web.Common.Utils;

namespace Sdl.Web.Modules.DynamicDocumentation.Models
{
    public class Conditions
    {
        public string PublicationId { get; set; }
        public Dictionary<string, object> UserConditions { get; set; }
        public override int GetHashCode()
        {
            int hash = (PublicationId ?? string.Empty).GetHashCode();
            if (UserConditions != null)
            {
                hash = UserConditions.Aggregate(hash, (current, x) => Hash.CombineHashCodes(current, x.Key.GetHashCode(), x.Value.GetHashCode()));
            }
            return hash;
        }
    }
}
