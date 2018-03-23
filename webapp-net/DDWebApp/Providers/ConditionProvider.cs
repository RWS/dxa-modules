using Sdl.Web.Common;
using Tridion.ContentDelivery.Meta;

namespace Sdl.Web.Modules.DDWebApp.Providers
{
    /// <summary>
    /// Condition Provider
    /// </summary>
    public class ConditionProvider
    {
        private static readonly string CONDITION_USED = "conditionsused.generated.value";
        private static readonly string CONDITION_METADATA = "conditionmetadata.generated.value";
        private static readonly string CONDITION_VALUES = "values";

        public string GetConditions(int publicationId)
        {
            // TODO
            var conditionUsed = GetMetadata(publicationId, CONDITION_USED);
            var conditionMetadata = GetMetadata(publicationId, CONDITION_METADATA);

            return "";
        }

        private string GetMetadata(int publicationId, string metadataName)
        {
            PublicationMetaFactory factory = new PublicationMetaFactory();
            PublicationMeta meta = factory.GetMeta(publicationId);
            if (meta?.CustomMeta == null)
            {
                throw new DxaItemNotFoundException(
                    $"Metadata '{metadataName}' is not found for publication {publicationId}.");
            }

            object metadata = meta.CustomMeta.GetFirstValue(metadataName);
            string metadataString = metadata != null ? (string)metadata : "{}";
            return metadataString;
        }
    }
}
