using Newtonsoft.Json.Linq;
using Sdl.Web.Common;
using Tridion.ContentDelivery.Meta;

namespace Sdl.Web.Modules.Ish.Providers
{
    /// <summary>
    /// Condition Provider
    /// </summary>
    public class ConditionProvider
    {
        private static readonly string ConditionUsed = "conditionsused.generated.value";
        private static readonly string ConditionMetadata = "conditionmetadata.generated.value";
        private static readonly string ConditionValues = "values";

        public string GetConditions(int publicationId)
        {
            var conditionUsed = GetMetadata(publicationId, ConditionUsed);
            var conditionMetadata = GetMetadata(publicationId, ConditionMetadata);

            JObject o1 = JObject.Parse(conditionUsed);
            JObject o2 = JObject.Parse(conditionMetadata);

            o1.Merge(o2, new JsonMergeSettings
            {
                // union array values together to avoid duplicates
                MergeArrayHandling = MergeArrayHandling.Union
            });

            return o1.ToString();
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
