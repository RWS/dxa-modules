using System;
using System.Collections.Generic;
using Sdl.Web.Common.Configuration;

namespace Sdl.Web.Modules.SmartTarget.Utils
{
    public class SmartTargetUtils
    {
        /// <summary>
        /// Validate parameters, if on Page Type is specified True or False return that, else use the core configuration setting.
        /// </summary>
        /// <param name="allowDuplicationOnSamePage"></param>
        /// <param name="localization"></param>
        /// <returns></returns>
        public static bool ParseAllowDuplicatesOnSamePage(string allowDuplicationOnSamePage, Localization localization)
        {
            if (string.IsNullOrEmpty(allowDuplicationOnSamePage) || "Use core configuration".Equals(allowDuplicationOnSamePage, StringComparison.OrdinalIgnoreCase))
            {
                string value = !string.IsNullOrEmpty(localization.GetConfigValue("smarttarget.allowDuplicationOnSamePageConfig"))
                    ? localization.GetConfigValue("smarttarget.allowDuplicationOnSamePageConfig")
                    : "true";
                
                return bool.Parse(value);
            }

            return Convert.ToBoolean(allowDuplicationOnSamePage);
        }

        /// <summary>
        /// Split out region view and module from region name
        /// </summary>
        /// <param name="regionResults">The regions that come back from the SmartTarget query as result</param>
        public static List<string> SplitRegions(string regionResults)
        {
            List<string> listRegions = new List<string>();

            if (string.IsNullOrEmpty(regionResults))
            {
                return listRegions;
            }

            // split regions on comma, and add them to the list
            foreach (string region in regionResults.Split(','))
            {
                listRegions.Add(region);
            }
            
            return listRegions;
        }


        /// <summary>
        /// Split out region view and module from region name
        /// </summary>
        /// <param name="regionName">The region name (can contain a module prefixed to it module:region)</param>
        public static string DetermineRegionName(string regionName)
        {
            if (string.IsNullOrEmpty(regionName))
            {
                return string.Empty;
            }

            // split region view on colon, use first part as area (module) name
            string[] regionViewParts = regionName.Split(':');

            return regionViewParts.Length > 1 ? regionViewParts[1].Trim() : regionViewParts[0].Trim();
        }
    }
}