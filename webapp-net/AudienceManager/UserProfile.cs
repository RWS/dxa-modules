using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Tridion.OutboundEmail.ContentDelivery.Profile;
using Tridion.OutboundEmail.ContentDelivery.Utilities;
using Tridion.ContentDelivery.AmbientData;

namespace Sdl.Web.Modules.AudienceManager
{
    /// <summary>
    /// UserProfile
    /// </summary>
    public class UserProfile
    {
        private readonly Contact _contact;

        protected UserProfile(Contact contact)
        {
            _contact = contact;
        }

        internal static UserProfile Create(Contact contact)
        {          
            return new UserProfile(contact);
        }

        public Contact Contact
        {
            get
            {
                return _contact;
            }
        }

        public bool VerifyPassword(string password)
        {
            // why do we need to digest the password and then pass that to the CheckPassword function?
            // this results in two service requests when really you only need to send the password over!
            return Digests.CheckPassword(password, Digests.DigestPassword(password));
        }

        public static void ClearCurrentVisitor()
        {
            AmbientDataContext.CurrentClaimStore.Remove(AudienceManagerClaims.AudienceManagerContact);
        }

        public static UserProfile CurrentVisitor
        {
            get
            {
                string tcmUri = AmbientDataContext.CurrentClaimStore.Get<string>(AudienceManagerClaims.AudienceManagerContact);
                if (!string.IsNullOrEmpty(tcmUri))
                {
                    TcmUri uri = new TcmUri(tcmUri);
                    Contact contact = Contact.GetFromInternalContactId(uri);
                    if (contact != null)
                    {
                        return Create(contact);
                    }
                    else
                    {
                        ClearCurrentVisitor();
                    }
                }
                return null;
            }
        }

        public void SetAsCurrentVisitor()
        {
            AmbientDataContext.CurrentClaimStore.Put(AudienceManagerClaims.AudienceManagerContact, Contact.Id.ToString());
            Contact.IdentifyAsCurrentVisitor();
        }
    }
}