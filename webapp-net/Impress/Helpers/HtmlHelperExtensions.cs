using Sdl.Web.Common.Models;
using System.Web.Mvc;

namespace Sdl.Web.Modules.Impress.Helpers
{
    public static class HtmlHelperExtensions
    {
        /// <summary>
        /// Return background image style attribute
        /// </summary>
        /// <param name="htmlHelper">HtmlHelper</param>
        /// <param name="image">The image</param>
        /// <returns>The background image style attribute, or empty string if no image available</returns>
        public static MvcHtmlString BgImgStyle(this HtmlHelper htmlHelper, MediaItem image)
        {
            if (string.IsNullOrEmpty(image?.Url))
            {
                return null;
            }
            return new MvcHtmlString($"style=\"background-image:url('{image.Url}');\"");
        }
    }
}
