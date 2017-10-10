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
        private const string EncryptedPrefix = "encrypted:";
        private readonly Contact _contact;
        private readonly string _userNameField;
        private readonly string _passwordField;

        internal UserProfile(Contact contact, string userNameField, string passwordField)
        {
            _contact = contact;
            _userNameField = userNameField;
            _passwordField = passwordField;
        }

        public Contact Contact => _contact;

        public string UserName => GetExtendedDetail(_userNameField);

        public string Password => GetExtendedDetail(_passwordField);

        public bool VerifyPassword(string password)
        {
            // passwords are stored in plaintext. any contacts made through the webapp will not store the 
            // password but instead it's digest. we identify this by a prefix of 'encrypted:'.
            string storedPassword = Password;
            if (storedPassword.StartsWith(EncryptedPrefix))
            {
                return Digests.CheckPassword(password, storedPassword.Substring(EncryptedPrefix.Length));
            }
            return password.Equals(storedPassword);
        }

        private string GetExtendedDetail(string fieldName)
        {
            ExtendedDetail detail = _contact.ExtendedDetails[fieldName];
            return detail?.StringValue;
        }

        public static void ClearCurrentVisitor()
        {
            AmbientDataContext.CurrentClaimStore.Remove(AudienceManagerClaims.AudienceManagerContact);
        }

        public void SetAsCurrentVisitor()
        {
            AmbientDataContext.CurrentClaimStore.Put(AudienceManagerClaims.AudienceManagerContact, _contact.Id.ToString(), Tridion.ContentDelivery.AmbientData.Runtime.ClaimValueScope.Session);
        }
    }
}