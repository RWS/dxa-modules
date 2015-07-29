using Sdl.Web.Common.Configuration;
using System;
using Tridion.SmartTarget.Utils;

namespace Sdl.Web.Modules.SmartTarget.Utils
{
    class SmartTargetUtils
    {
        /// <summary>
        /// Reads the 'DefaultAllowDuplicates' option from the ConfigurationUtility
        /// </summary>
        public static bool DefaultAllowDuplicates
        {
            get
            {
                return ConfigurationUtility.DefaultAllowDuplicates;
            }
        }

        /// <summary>
        /// Validates the input parameter against 'Yes' and 'No' for configuration, 
        /// else returns the value from configuration
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static bool Parse(string value)
        {
            if ("No".Equals(value, StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }
            else if ("Yes".Equals(value, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            return DefaultAllowDuplicates;
        }

        /// <summary>
        /// Split out region view and module from region name
        /// </summary>
        /// <param name="regionName">The region name (can contain a module prefixed to it module:region)</param>
        /// <param name="module">Returns the module name, will use default if no module name is prefixed, <see cref="SiteConfiguration.GetDefaultModuleName()"/></param>
        /// <param name="view">Returns the view name</param>
        public static void DetermineRegionViewNameAndModule(string regionName, out string module, out string view)
        {
            view = null;
            module = SiteConfiguration.GetDefaultModuleName(); // default module

            if (!string.IsNullOrEmpty(regionName))
            {
                // split region view on colon, use first part as area (module) name
                string[] regionViewParts = regionName.Split(':');

                if (regionViewParts.Length > 1)
                {
                    module = regionViewParts[0].Trim();
                    view = regionViewParts[1].Trim();
                }
                else
                {
                    view = regionViewParts[0].Trim();
                }
            }
        }
    }
}