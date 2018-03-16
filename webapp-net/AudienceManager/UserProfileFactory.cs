using System;
using System.Web;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Logging;
using Sdl.Web.Mvc.Configuration;
using Tridion.ContentDelivery.AmbientData;
using Tridion.OutboundEmail.ContentDelivery.Profile;

namespace Sdl.Web.Modules.AudienceManager
{
    /// <summary>
    /// Factory class for Audience Manager User Profiles.
    /// </summary>
    public static class UserProfileFactory
    {
        private const string UserProfileCacheRegionName = "UserProfile";

        /// <summary>
        /// Gets the User Profile for the currently logged in user.
        /// </summary>
        public static UserProfile CurrentLoggedInUser
        {
            get
            {
                string currentUserName = HttpContext.Current.User.Identity.Name;
                using (new Tracer(currentUserName))
                {
                    if (string.IsNullOrEmpty(currentUserName))
                    {
                        return null;
                    }

                    // We include the Localization ID in the cache key, because a user name may resolve to a different Contact / User Profile
                    // in a different context Localization (associated with a different AM Sync Target).
                    string cacheKey = $"{currentUserName}:{WebRequestContext.Localization.Id}";

                    return SiteConfiguration.CacheProvider.GetOrAdd(
                        cacheKey,
                        UserProfileCacheRegionName,
                        () => GetUserProfile(currentUserName)
                        );
                }
            }
        }

        /// <summary>
        /// Gets the User Profile for a given identification key.
        /// </summary>
        /// <param name="identificationKey">The identification key.</param>
        /// <returns>The <see cref="UserProfile"/> or <c>null</c> if no User Profile is found for the given identification key.</returns>
        public static UserProfile GetUserProfile(string identificationKey)
        {
            using (new Tracer(identificationKey))
            {
                if (string.IsNullOrEmpty(identificationKey))
                {
                    return null;
                }

                ILocalization localization = WebRequestContext.Localization;

                // Audience Manager reads the context Publication ID from ADF:
                AmbientDataContext.CurrentClaimStore.Put(new Uri("taf:claim:publication:id"), localization.Id);

                string contactImportSources = localization.GetConfigValue("audiencemanager.contactImportSources");
                Contact contact = null;
                if (string.IsNullOrEmpty(contactImportSources))
                {
                    contact = FindContact(identificationKey);
                }
                else
                {
                    foreach (string importSource in contactImportSources.Split(','))
                    {
                        contact = FindContact(identificationKey, importSource);
                        if (contact != null)
                        {
                            break;
                        }
                    }
                }

                if (contact == null)
                {
                    Log.Debug("No Audience Manager Contact found for identification key '{0}' and Import Sources '{1}'.", identificationKey, contactImportSources);
                    return null;
                }

                Log.Debug("Audience Manager identification key '{0}' resolved to Contact '{1}' (Email: '{2}').", identificationKey, contact.Id, contact.EmailAddress);

                string userNameField = localization.GetConfigValue("audiencemanager.userNameField");
                string passwordField = localization.GetConfigValue("audiencemanager.passwordField");
                Log.Debug("User Name Field: '{0}'. Password Field: '{1}'", userNameField, passwordField);

                return new UserProfile(contact, userNameField, passwordField);
            }
        }

        private static Contact FindContact(string identificationKey, string importSource = null)
        {
            using (new Tracer(importSource, identificationKey))
            {
                // NOTE: Identification key comes first followed by import source otherwise you'll not get a match!
                string[] identifiers = (importSource == null) ? new [] { identificationKey} : new[] { identificationKey, importSource };
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