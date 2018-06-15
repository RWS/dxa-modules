using System;
using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Ugc.Models
{
    [Serializable]
    public class UgcRegion : RegionModel
    {
        public UgcRegion(string name)
            : base(name)
        {
        }

        public UgcRegion(string name, string qualifiedViewName)
            : base(name, qualifiedViewName)
        {
        }
    }
}
