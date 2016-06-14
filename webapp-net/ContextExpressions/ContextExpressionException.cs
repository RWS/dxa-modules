using System;
using Sdl.Web.Common;

namespace Sdl.Web.Modules.ContextExpressions
{
    public class ContextExpressionException : DxaException
    {
        public ContextExpressionException(string message, Exception inner = null)
            : base(message, inner)
        {
        }
    }
}
