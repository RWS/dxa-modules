using Tridion.OutboundEmail.ContentDelivery.Profile;
using Tridion.OutboundEmail.ContentDelivery.Utilities;
using Tridion.ContentDelivery.AmbientData;

namespace Sdl.Web.Modules.AudienceManager
{
    /// <summary>
    /// Represents a User Profile obtained from Audience Manager
    /// </summary>
    public class UserProfile
    {
        private const string PasswordFieldName = "Password";
        private const string EncryptedPrefix = "encrypted:";

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
                return GetExtendedDetail(PasswordFieldName);
            }
        }
   
        public bool VerifyPassword(string password)
        {
            // passwords are stored in plaintext. any contacts made through the webapp will not store the 
            // password but instead it's digest. we identify this by a prefix of 'encrypted:'.
            string storedPassword = Password;
            if (storedPassword.StartsWith(EncryptedPrefix))
            {
                return Digests.CheckPassword(password, storedPassword.Substring(EncryptedPrefix.Length));
            }
            else
            {
                return password.Equals(storedPassword);
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
                if (string.IsNullOrEmpty(tcmUri))
                {
                    return null;
                }
                TcmUri uri = new TcmUri(tcmUri);
                Contact contact = Contact.GetFromInternalContactId(uri);
                if (contact == null)
                {
                    ClearCurrentVisitor();
                    return null;
                }
                return Create(contact);
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