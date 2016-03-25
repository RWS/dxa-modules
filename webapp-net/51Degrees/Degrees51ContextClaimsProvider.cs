using System.Collections.Generic;
using Sdl.Web.Common.Interfaces;

namespace Sdl.Web.Modules.Degrees51
{
    public class Degrees51ContextClaimsProvider : IContextClaimsProvider
    {
        public IDictionary<string, object> GetContextClaims(string aspectName)
        {
            throw new System.NotImplementedException(); // TODO
        }

        public string GetDeviceFamily()
        {
            return null;
        }
    }
}
