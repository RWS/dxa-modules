using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Models;
using System;
using Sdl.Web.Common.Interfaces;

namespace Sdl.Web.Modules.SmartTarget.Models
{
    [Serializable]
    public class SmartTargetItem
    {
        private readonly ILocalization _localization;
        private EntityModel _entity;

        public string EntityId { get; private set; }

        /// <summary>
        /// Gets the Entity Model.
        /// </summary>
        /// <remarks>
        /// The Entity Model is lazy loaded. That is: it is loaded only if this property is accessed.
        /// </remarks>
        public EntityModel Entity => _entity ?? (_entity = SiteConfiguration.ContentProvider.GetEntityModel(EntityId, _localization));

        public SmartTargetItem(string entityId, ILocalization localization)
        {
            EntityId = entityId;
            _localization = localization;
        }
    }
}
