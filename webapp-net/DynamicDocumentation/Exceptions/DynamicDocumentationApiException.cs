using System;

namespace Sdl.Web.Modules.DynamicDocumentation.Exceptions
{
    /// <summary>
    /// Api Exception
    /// </summary>
    public class ApiException : Exception
    {
        public ApiException()
        {
        }

        public ApiException(string msg) : base(msg)
        {
        }

        public ApiException(string msg, Exception innerException) : base(msg, innerException)
        {
        }
    }
}
