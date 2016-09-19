using System;
using Sdl.Web.Common.Logging;
using Sdl.Web.Mvc.Configuration;
using Tridion.OutboundEmail.ContentDelivery.Profile;

namespace Sdl.Web.Modules.AudienceManager
{
    /// <summary>
    /// Factory class for Audience Manager User Profiles.
    /// </summary>
    public static class UserProfileFactory
    {
        public static UserProfile GetUserProfile(string identificationKey)
        {
            using (new Tracer(identificationKey))
            {
                string contactImportSources = WebRequestContext.Localization.GetConfigValue("audiencemanager.contactImportSources");
                if (string.IsNullOrEmpty(contactImportSources))
                {
                    Log.Warn("No Audience Manager Contact Import Sources are configured.");
                    return null;
                }

                foreach (string importSource in contactImportSources.Split(','))
                {
                    Contact contact = FindContact(importSource, identificationKey);
                    if (contact != null)
                    {
                        Log.Debug("Audience Manager identification key '{0}' in import source '{1}' resolved to Contact '{2}' (Email: '{3}').",
                            identificationKey, importSource, contact.Id, contact.EmailAddress);
                        return UserProfile.Create(contact);
                    }
                }

                Log.Debug("No Audience Manager Contact found for identification key '{0} and Import Sources '{1}''.", identificationKey, contactImportSources);
                return null;
            }
        }

        private static Contact FindContact(string importSource, string identificationKey)
        {
            using (new Tracer(importSource, identificationKey))
            {
                if (string.IsNullOrEmpty(importSource) || string.IsNullOrEmpty(identificationKey))
                {
                    return null;
                }

                // NOTE: Identification key comes first followed by import source otherwise you'll not get a match!
                string[] identifiers = new[] { identificationKey, importSource };
                try
                {
                    return Contact.GetFromContactIdentificatonKeys(identifiers);
                }
                catch (ContactDoesNotExistException)
                {
                    // Contact does not exist in the given import source
                    return null;
                }
                catch (Exception ex)
                {
                    // Something is wrong; log this as an ERROR.
                    Log.Error(ex);
                    return null;
                }
            }
        }
    }
}