using Sdl.Web.Common.Configuration;
using Sdl.Web.Tridion.TridionDocs.Localization;

namespace Sdl.Web.Modules.DynamicDocumentation.Localization
{
    /// <summary>
    /// Localization Implementation
    /// </summary>
    public class DynamicDocumentationLocalization : DocsLocalization
    {             
        public override bool IsXpmEnabled { get; set; } = false; // no xpm on dd-webapp

        public override string BinaryCacheFolder => $"{SiteConfiguration.StaticsFolder}\\DynamicDocumentation";       
    }
}