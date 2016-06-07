using System.Collections.Generic;
using System.Web;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.ContextExpressions
{
    /// <summary>
    /// Conditional Entity Evaluator which evaluates Context Expression Conditions set as <see cref="ViewModel.ExtensionData"/> by the <see cref="ContextExpressionModelBuilder"/>.
    /// </summary>
    public class ContextExpressionEvaluator : IConditionalEntityEvaluator
    {
        #region IConditionalEntityEvaluator members
        /// <summary>
        /// Determines whether a given Entity Model should be included based on the conditions specified on the Entity Model and the context.
        /// </summary>
        /// <param name="entity">The Entity Model to be evaluated.</param>
        /// <returns><c>true</c> if the Entity should be included.</returns>
        public bool IncludeEntity(EntityModel entity)
        {
            using (new Tracer(entity))
            {
                object ceExtensionData;
                if (entity.ExtensionData == null || !entity.ExtensionData.TryGetValue(Constants.ContextExpressionsKey, out ceExtensionData))
                {
                    // No Context Expressions defined for Entity: just include it.
                    return true;
                }
                ContextExpressionConditions ceConditions = (ContextExpressionConditions) ceExtensionData;

                IDictionary<string, object> contextClaims = GetCachedContextClaims();

                if (ceConditions.Include != null)
                {
                    foreach (string contextExpression in ceConditions.Include)
                    {
                        bool? contextClaim = TryGetContextExpressionClaim(contextExpression, contextClaims);
                        if (!contextClaim.HasValue)
                        {
                            continue;
                        }
                        if (!contextClaim.Value)
                        {
                            Log.Debug("Context Claim for Include Context Expression '{0}' is 'false'; supressing Entity [{1}]", contextExpression, entity);
                            return false;
                        }
                    }
                }

                if (ceConditions.Exclude != null)
                {
                    foreach (string contextExpression in ceConditions.Exclude)
                    {
                        bool? contextClaim = TryGetContextExpressionClaim(contextExpression, contextClaims);
                        if (!contextClaim.HasValue)
                        {
                            continue;
                        }
                        if (contextClaim.Value)
                        {
                            Log.Debug("Context Claim for Exclude Context Expression '{0}' is 'true'; supressing Entity [{1}]", contextExpression, entity);
                            return false;
                        }
                    }
                }

                Log.Debug("All Context Expression conditions are satisfied; keeping Entity [{0}].", entity);
                return true;
            }
        }
        #endregion

        private static IDictionary<string, object> GetCachedContextClaims()
        {
            // TODO TSI-110: This is a temporary measure to cache the Context Claims per request
            IDictionary<string, object> result = null;
            HttpContext httpContext = HttpContext.Current;
            const string contextClaimsKey = "ContextClaims";
            if (httpContext != null)
            {
                result = httpContext.Items[contextClaimsKey] as IDictionary<string, object>;
            }

            if (result != null)
            {
                return result;
            }

            result = SiteConfiguration.ContextClaimsProvider.GetContextClaims(null);

            if (httpContext != null)
            {
                httpContext.Items[contextClaimsKey] = result;
            }

            return result;
        }

        private static bool? TryGetContextExpressionClaim(string name, IDictionary<string, object> contextClaims)
        {
            object claimValue;
            if (!contextClaims.TryGetValue(name, out claimValue))
            {
                Log.Warn("No Context Claim found for Context Expression '{0}'.", name);
                return null;
            }

            if (claimValue is bool)
            {
                return (bool) claimValue;
            }

            Log.Warn("Context Claim '{0}' is of type '{1}', but expected a boolean value for Context Expressions.", claimValue.GetType().Name);
            return null;
        }
    }
}
