using System;
using Sdl.Web.Common;

namespace Sdl.Web.Modules.Search
{
    public class DxaSearchException : DxaException
    {
        public DxaSearchException(string message, Exception innerException = null)
                : base(message, innerException)
        {
        }
    }
}
