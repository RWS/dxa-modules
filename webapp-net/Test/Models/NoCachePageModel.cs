using Sdl.Web.Common.Models;
using Sdl.Web.Common;

namespace Sdl.Web.Modules.Test.Models
{
    [DxaNoCache]
    public class NoCachePageModel : PageModel
    {
        public NoCachePageModel(string id)
                : base(id)
        {
        }
        
    }
}
