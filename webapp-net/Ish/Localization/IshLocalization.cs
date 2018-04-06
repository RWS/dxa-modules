using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Logging;

namespace Sdl.Web.Modules.Ish.Localization
{
    /// <summary>
    /// Ish Localization Implementation
    /// </summary>
    public class IshLocalization : Common.Configuration.Localization
    {     
        public override string Path { get; set; } = ""; // content path

        public override string CmUriScheme { get; } = "ish";

        public override bool IsXpmEnabled { get; set; } = false; // no xpm on dd-webapp

        public override string BinaryCacheFolder => $"{SiteConfiguration.StaticsFolder}\\DDWebApp";

        protected override void Load()
        {
            using (new Tracer(this))
            {
                LastRefresh = DateTime.Now;
            }
        }

        public override bool IsStaticContentUrl(string urlPath)
        {
            List<string> mediaPatterns = new List<string>();
            mediaPatterns.Add("^/favicon.ico");
            mediaPatterns.Add($"^{Path}/{SiteConfiguration.SystemFolder}/assets/.*");
            mediaPatterns.Add($"^{Path}/{SiteConfiguration.SystemFolder}/.*\\.json$");
            StaticContentUrlPattern = string.Join("|", mediaPatterns);
            Regex staticContentUrlRegex = new Regex(StaticContentUrlPattern, RegexOptions.IgnoreCase | RegexOptions.Compiled);
            return staticContentUrlRegex.IsMatch(urlPath);
        }
    }
}