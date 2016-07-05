using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Sdl.Web.Tridion.Context;

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

                if (!EvaluateContextExpressionClaims(ceConditions.Include, true, contextClaims))
                {
                    Log.Debug("Include Context Expression conditions are not satisfied; suppressing Entity [{0}].", entity);
                    return false;
                }
                if (!EvaluateContextExpressionClaims(ceConditions.Exclude, false, contextClaims))
                {
                    Log.Debug("Exclude Context Expression conditions are not satisfied; suppressing Entity [{0}].", entity);
                    return false;
                }

                Log.Debug("All resolved Context Expression conditions are satisfied; keeping Entity [{0}].", entity);
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

            IContextClaimsProvider contextClaimsProvider = SiteConfiguration.ContextClaimsProvider;
            if (contextClaimsProvider is AdfContextClaimsProvider)
            {
                result = SiteConfiguration.ContextClaimsProvider.GetContextClaims(null);
            }
            else
            {
                throw new ContextExpressionException(
                    string.Format("Context Expressions Module requires use of AdfContextClaimsProvider, but '{0}' is currently used.", contextClaimsProvider.GetType().Name) 
                    );
            }

            if (httpContext != null)
            {
                httpContext.Items[contextClaimsKey] = result;
            }

            return result;
        }

        private static bool EvaluateContextExpressionClaims(string[] names, bool include, IDictionary<string, object> contextClaims)
        {
            if (names == null || names.Length == 0)
            {
                return true;
            }

            IList<bool> resolvedContextClaimValues = new List<bool>(names.Length);
            foreach (string name in names)
            {
                try
                {
                    object claimValue;
                    if (!contextClaims.TryGetValue(name, out claimValue))
                    {
                        throw new ContextExpressionException(string.Format("No Context Claim found for Context Expression '{0}'", name));
                    }

                    if (!(claimValue is bool))
                    {
                        throw new ContextExpressionException(
                            string.Format("Context Claim '{0}' is of type '{1}', but expected a boolean value for Context Expression.", name, claimValue.GetType().Name)
                            );
                    }

                    resolvedContextClaimValues.Add((bool) claimValue);
                }
                catch (ContextExpressionException ex)
                {
                    Log.Warn("{0}. Ignoring Context Expression condition.", ex.Message);
                }
            }

            if (!resolvedContextClaimValues.Any())
            {
                // We couldn't resolve any of the conditions. Keep the Entity.
                return true;
            }

            // Any matching Include condition is enough to keep the Entity.
            // Any matching Exclude condition is enough to suppress the Entity.
            bool matchingConditionFound = resolvedContextClaimValues.Any(val => val);
            return include ? matchingConditionFound : !matchingConditionFound;
        }
    }
}
