using Sdl.Web.Common.Logging;
using Sdl.Web.Mvc.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Tridion.OutboundEmail.ContentDelivery.Profile;

namespace Sdl.Web.Modules.AudienceManager
{
    /// <summary>
    /// AudienceManagerFactory
    /// </summary>
    public static class AudienceManagerFactory
    {
        public static UserProfile GetUser(string emailAddress)
        {
            string[] importSources = new string[0];
            string sourceCSV = WebRequestContext.Localization.GetConfigValue("audiencemanager.contactImportSources");
            if(!string.IsNullOrEmpty(sourceCSV))
            {
                importSources = sourceCSV.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            }

            foreach (string importSource in importSources)
            {
                Contact contact = GetContactByImportSourceAndIdKey(importSource, emailAddress);
                if (contact != null)
                {
                    return UserProfile.Create(contact);
                }
            }
            // no contact found
            return null;
        }      

        private static Contact GetContactByImportSourceAndIdKey(string importSource, string idKey)
        {
            if (!string.IsNullOrEmpty(importSource) && !string.IsNullOrEmpty(idKey))
            {
                // identification key comes first followed by import source otherwise you'll not get a match!
                var identifiers = new string[] { idKey, importSource };
                try
                {
                    if (Contact.Exists(identifiers))
                    {
                        return Contact.GetFromContactIdentificatonKeys(identifiers);
                    }
                }
                catch
                {
                    Log.Info("Contact not found for import source {0} and identification key {1}", importSource, idKey);
                }
            }
            return null;
        }
    }
}