using System;
using System.Web;
using Sdl.Web.Common;
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
        /// <summary>
        /// Gets the User Profile for the currently logged in user.
        /// </summary>
        public static UserProfile CurrentLoggedInUser
        {
            get
            {
                return GetUserProfile(HttpContext.Current.User.Identity.Name);
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
                if (!string.IsNullOrEmpty(identificationKey))
                {
                    string contactImportSources = WebRequestContext.Localization.GetConfigValue("audiencemanager.contactImportSources");
                    if (string.IsNullOrEmpty(contactImportSources))
                    {
                        Log.Warn("No Audience Manager Contact Import Sources are configured.");
                        return null;
                    }

                    PreparePublicationResolving();

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

                    Log.Debug("No Audience Manager Contact found for identification key '{0}' and Import Sources '{1}'.", identificationKey, contactImportSources);
                }
                return null;
            }
        }

        /// <summary>
        /// Prepares for Audience Manager Publication Resolving.
        /// </summary>
        /// <remarks>
        /// Audience Manager tries to resolve the context Publication based on the <c>taf:request:full_url</c> ADF claim.
        /// However, this will fail if the Request URL is extensionless (which it typically is in DXA).
        /// As a work-around, we ensure that the <c>taf:request:full_url</c> ADF claim has a file extension here.
        /// </remarks>
        private static void PreparePublicationResolving()
        {
            string pageUrl = HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority) + WebRequestContext.PageModel.Url;
            if (!pageUrl.EndsWith(Constants.DefaultExtension))
            {
                pageUrl += Constants.DefaultExtension;
            }
            AmbientDataContext.CurrentClaimStore.Put(new Uri("taf:request:full_url"), pageUrl);
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
#if TRIDION_71
                catch (Tridion.OutboundEmail.ContentDelivery.AudienceManagementException)
#else            
                catch (ContactDoesNotExistException)
#endif
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