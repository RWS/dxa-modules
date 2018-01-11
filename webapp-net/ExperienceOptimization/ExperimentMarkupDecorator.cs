using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Sdl.Web.Modules.SmartTarget.Models;
using Sdl.Web.Mvc.Html;
using Tridion.SmartTarget.Analytics;

namespace Sdl.Web.Modules.SmartTarget
{
    /// <summary>
    /// Decorates the HTML markup rendered by a <see cref="SmartTargetExperiment"/> View: rewrites hyperlinks to enable analytics tracking
    /// </summary>
    public class ExperimentMarkupDecorator : IMarkupDecorator
    {
        private AnalyticsManager _analyticsManager;

        #region IMarkupDecorator members
        /// <summary>
        /// Decorates the HTML markup rendered by an Entity or Region View.
        /// </summary>
        /// <param name="htmlToDecorate">The HTML to decorate.</param>
        /// <param name="viewModel">The <see cref="ViewModel"/> associated with the HTML fragment.</param>
        /// <returns>The decorated HTML.</returns>
        public string DecorateMarkup(string htmlToDecorate, ViewModel viewModel)
        {
            SmartTargetExperiment experiment = viewModel as SmartTargetExperiment;
            if (experiment == null)
            {
                // Not a ST Experiment; nothing to do.
                return htmlToDecorate;
            }

            using (new Tracer(htmlToDecorate, viewModel))
            {
                if (_analyticsManager == null)
                {
                    // NOTE: might overwrite in a race condition, but that's not a problem.
                    _analyticsManager = new AnalyticsManager();
                }
                AnalyticsMetaData analyticsMetaData = new AnalyticsMetaData();
                _analyticsManager.TrackView(experiment.ExperimentDimensions, analyticsMetaData);
                _analyticsManager.TrackConversion(experiment.ExperimentDimensions, analyticsMetaData);
                return _analyticsManager.AddTrackingToLinks(htmlToDecorate, experiment.ExperimentDimensions, analyticsMetaData);
            }
        }
        #endregion
    }
}
