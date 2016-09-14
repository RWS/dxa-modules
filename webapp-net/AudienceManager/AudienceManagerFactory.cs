using Sdl.Web.Common.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Tridion.OutboundEmail.ContentDelivery.Profile;

namespace Sdl.Web.Modules.AudienceManager
{
    public static class AudienceManagerFactory
    {
        public static UserProfile GetUser(string emailAddress)
        {
            List<string> sources = new List<string>();
            // TODO: get sources from configuration CSV format
            // WebRequestContext.Localization.GetConfigValue("audiencemanager.contactImportSources");
            foreach (string source in sources)
            {
                Contact contact = GetContactBySourceKey(source, emailAddress);
                if (contact != null)
                {
                    return UserProfile.Create(contact);
                }
            }

            // no contact found
            return null;
        }

        public static UserProfile GetUserBySourceKey(string source, string key)
        {
            Contact contact = GetContactBySourceKey(source, key);
            if (contact != null)
            {
                return UserProfile.Create(contact);
            }
            else
            {
                return null;
            }
        }

        private static Contact GetContactBySourceKey(string source, string key)
        {
            if (!string.IsNullOrEmpty(source) && !string.IsNullOrEmpty(key))
            {
                var identifiers = new string[] { key, source };
                try
                {
                    if (Contact.Exists(identifiers))
                    {
                        return Contact.GetFromContactIdentificatonKeys(identifiers);
                    }
                }
                catch
                {
                    Log.Info("Contact not found for identifiers {0}:{1}", source, key);
                }
            }
            return null;
        }
    }
}