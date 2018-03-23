using Sdl.Web.Common.Configuration;

namespace Sdl.Web.Modules.DDWebApp.Localization
{
    /// <summary>
    /// Ish Localization Implementation
    /// </summary>
    public class IshLocalization : Common.Configuration.Localization
    {
        public IshLocalization()
        {
            /*
            List<string> mediaPatterns = new List<string>();

            mediaPatterns.Add("^/favicon.ico");
            mediaPatterns.Add(String.Format("^{0}/{1}/assets/.*", Path, SiteConfiguration.SystemFolder));
            mediaPatterns.Add(String.Format("^{0}/{1}/.*\\.json$", Path, SiteConfiguration.SystemFolder));

            StaticContentUrlPattern = String.Join("|", mediaPatterns);
            _staticContentUrlRegex = new Regex(StaticContentUrlPattern, RegexOptions.IgnoreCase | RegexOptions.Compiled);
            */
        }

        public override string Path { get; set; } = "/DDWebApp"; // content path

        public override string CmUriScheme { get; } = "ish";

        public override bool IsXpmEnabled { get; set; } = false; // no xpm on dd-webapp

        public override string BinaryCacheFolder => $"{SiteConfiguration.StaticsFolder}\\DDWebApp";

        //public override bool IsStaticContentUrl(string urlPath)
        //{
        //    return true;
        //}
    }
}