using System;
using System.Collections.Generic;
using System.Linq;
using DD4T.ContentModel;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Sdl.Web.Tridion.Mapping;
using IPage = DD4T.ContentModel.IPage;

namespace Sdl.Web.Modules.ContextExpressions
{
    /// <summary>
    /// Model Builder which enriches Entity Models (on a Page) with <see cref="ContextExpressionConditions"/> based on Component Presentation conditions in CM.
    /// </summary>
    /// <remarks>
    /// This Model Builder should be configured in the modelBuilderPipeline section in Web.config to run after the <see cref="DefaultModelBuilder"/>.
    /// </remarks>
    public class ContextExpressionModelBuilder : IModelBuilder
    {

        #region IModelBuilder members
        public void BuildPageModel(ref PageModel pageModel, IPage page, IEnumerable<IPage> includes, Localization localization)
        {
            // Nothing to do here
        }

        public void BuildEntityModel(ref EntityModel entityModel, IComponentPresentation cp, Localization localization)
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

        public void BuildEntityModel(ref EntityModel entityModel, IComponent component, Type baseModelType, Localization localization)
        {
            // Nothing to do here
        }
        #endregion
    }
}
