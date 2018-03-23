using System;

namespace Sdl.Web.Modules.DDWebApp.Exceptions
{
    /// <summary>
    /// Ish Api Exception
    /// </summary>
    public class IshApiException : Exception
    {
        public IshApiException(string msg) : base(msg)
        {
        }

        public IshApiException(string msg, Exception innerException) : base(msg, innerException)
        {
        }
    }
}
