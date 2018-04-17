using System;

namespace Sdl.Web.Modules.TridionDocs.Exceptions
{
    /// <summary>
    /// TridionDocs Api Exception
    /// </summary>
    public class TridionDocsApiException : Exception
    {
        public TridionDocsApiException(string msg) : base(msg)
        {
        }

        public TridionDocsApiException(string msg, Exception innerException) : base(msg, innerException)
        {
        }
    }
}
