using Sdl.Web.Common.Models;
using System.Globalization;
using Sdl.Web.Common.Configuration;

namespace Sdl.Web.Modules.Test.Models
{
    [SemanticEntity(CoreVocabulary, "ExternalContentLibraryStubSchemaflickr", Prefix = "test", Public = true)]
    public class TestFlickrImageModel : EclItem
    {
        [SemanticProperty("test:testProp1")]
        public string TestProperty1
        {
            get;
            set;
        }

        public override MvcData GetDefaultView(Localization localization)
        {
            return new MvcData("FlickrImage:" + EclDisplayTypeId);
        }

        public override string ToHtml(string widthFactor, double aspect = 0, string cssClass = null, int containerSize = 0)
        {
            string classAttr = string.IsNullOrEmpty(cssClass) ? string.Empty : string.Format(" class=\"{0}\"", cssClass);
            string widthAttr = string.IsNullOrEmpty(widthFactor) ? string.Empty : string.Format(" width=\"{0}\"", widthFactor);
            string aspectAttr = (aspect == 0) ? string.Empty : string.Format(" data-aspect=\"{0}\"", aspect.ToString(CultureInfo.InvariantCulture));
            return string.Format("<img src=\"{0}\"{1}{2}{3}>", Url, widthAttr, aspectAttr, classAttr);
        }
    }


}
