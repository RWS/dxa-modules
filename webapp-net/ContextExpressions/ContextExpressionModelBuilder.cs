using System;
using System.Collections.Generic;
using System.Linq;
using DD4T.ContentModel;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Sdl.Web.DataModel;
using Sdl.Web.Tridion.Mapping;
using IPage = DD4T.ContentModel.IPage;

namespace Sdl.Web.Modules.ContextExpressions
{
    /// <summary>
    /// Model Builder which enriches Entity Models (on a Page) with <see cref="ContextExpressionConditions"/> based on Component Presentation conditions in CM.
    /// </summary>
    /// <remarks>
    /// This Model Builder should be configured in the modelBuilderPipeline section in Web.config to run after the <see cref="DefaultModelBuilder"/>.
    /// It can act both as Legacy Model Builder (<see cref="IModelBuilder"/>) and as R2 Model Builder (<see cref="IPageModelBuilder"/>).
    /// </remarks>
    public class ContextExpressionModelBuilder : IModelBuilder, IEntityModelBuilder
    {
        #region IModelBuilder members
        public void BuildPageModel(ref PageModel pageModel, IPage page, IEnumerable<IPage> includes, ILocalization localization)
        {
            // Nothing to do here
        }

        public void BuildEntityModel(ref EntityModel entityModel, IComponentPresentation cp, ILocalization localization)
        {
            using (new Tracer(entityModel, cp, localization))
            {
                IFieldSet contextExpressionsFieldSet;
                if (cp.ExtensionData == null || !cp.ExtensionData.TryGetValue(Constants.ContextExpressionsKey, out contextExpressionsFieldSet))
                {
                    // No Context Expressions found; nothing to do.
                    return;
                }

                ContextExpressionConditions conditions = new ContextExpressionConditions();
                IField includeField;
                if (contextExpressionsFieldSet.TryGetValue("Include", out includeField))
                {
                    conditions.Include = includeField.Values.ToArray();
                }
                IField excludeField;
                if (contextExpressionsFieldSet.TryGetValue("Exclude", out excludeField))
                {
                    conditions.Exclude = excludeField.Values.ToArray();
                }

                entityModel.SetExtensionData(Constants.ContextExpressionsKey, conditions);
            }
        }

        public void BuildEntityModel(ref EntityModel entityModel, IComponent component, Type baseModelType, ILocalization localization)
        {
            // Nothing to do here
        }
        #endregion

        #region IEntityModelBuilder members
        /// <summary>
        /// Builds a strongly typed Entity Model based on a given DXA R2 Data Model.
        /// </summary>
        /// <param name="entityModel">The strongly typed Entity Model to build. Is <c>null</c> for the first Entity Model Builder in the pipeline.</param>
        /// <param name="entityModelData">The DXA R2 Data Model.</param>
        /// <param name="baseModelType">The base type for the Entity Model to build.</param>
        /// <param name="localization">The context <see cref="ILocalization"/>.</param>
        public void BuildEntityModel(ref EntityModel entityModel, EntityModelData entityModelData, Type baseModelType, ILocalization localization)
        {
            using (new Tracer(entityModel, entityModelData, baseModelType, localization))
            {
                IDictionary<string, object> extensionData = entityModel.ExtensionData;
                if (extensionData == null) return;
                object contextExpression;
                extensionData.TryGetValue("ContextExpressions", out contextExpression);
                if (contextExpression == null) return;
                ContentModelData contextExpressionData = (ContentModelData) contextExpression;
                ContextExpressionConditions cxConditions = new ContextExpressionConditions();
                if (contextExpressionData.ContainsKey("Include"))
                {
                    if (contextExpressionData["Include"] is string[])
                    {
                        cxConditions.Include = (string[]) contextExpressionData["Include"];
                    }
                    else
                    {
                        cxConditions.Include = new string[] {(string) contextExpressionData["Include"]};
                    }
                }
                if (contextExpressionData.ContainsKey("Exclude"))
                {
                    if (contextExpressionData["Exclude"] is string[])
                    {
                        cxConditions.Exclude = (string[]) contextExpressionData["Exclude"];
                    }
                    else
                    {
                        cxConditions.Exclude = new string[] { (string)contextExpressionData["Exclude"] };
                    }
                }
                extensionData.Remove("ContextExpressions");
                extensionData.Add(Constants.ContextExpressionsKey, cxConditions);               
            }
        }
        #endregion
    }
}
