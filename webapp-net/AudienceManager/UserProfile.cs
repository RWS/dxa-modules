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
        private static readonly string EXT_PASSWORD = "Password";
        private static readonly string EXT_ENCRYPTED = "encrypted:";

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

        public string Password
        {
            get
            {
                return GetExtendedDetail(EXT_PASSWORD);
            }
        }
   
        public bool VerifyPassword(string password)
        {
            // passwords are stored in plaintext. any contacts made through the webapp will not store the 
            // password but instead it's digest. we identify this by a prefix of 'encrypted:'.
            string storedPword = Password;
            if (storedPword.StartsWith(EXT_ENCRYPTED))
            {
                return Digests.CheckPassword(password, storedPword.Substring(EXT_ENCRYPTED.Length));
            }
            else
            {
                return password.Equals(storedPword);
            }
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

        private string GetExtendedDetail(string fieldName)
        {
            ExtendedDetail detail = _contact.ExtendedDetails[fieldName];
            return detail != null ? detail.StringValue : null;
        }
    }
}