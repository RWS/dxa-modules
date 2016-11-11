using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Models;
using System;

namespace Sdl.Web.Modules.SmartTarget.Models
{
    [Serializable]
    public class SmartTargetItem
    {
        private readonly Localization _localization;
        private EntityModel _entity;

        public string EntityId { get; private set; }

        /// <summary>
        /// Gets the Entity Model.
        /// </summary>
        /// <remarks>
        /// The Entity Model is lazy loaded. That is: it is loaded only if this property is accessed.
        /// </remarks>
        public EntityModel Entity 
        {
            get
            {
                if (_entity == null)
                {
                    _entity = SiteConfiguration.ContentProvider.GetEntityModel(EntityId, _localization);
                }
                return _entity;
            }
        }

        public SmartTargetItem(string entityId, Localization localization)
        {
            EntityId = entityId;
            _localization = localization;
        }
    }
}
