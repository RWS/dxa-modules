using Sdl.Web.Common.Models;
using System;

namespace Sdl.Web.Modules.Impress.Models
{
    [Serializable]
    public class Slide : EntityModel
    {
        public RichText Content { get; set; }
        public string StepTitle { get; set; }
        public int XCoordinate { get; set; }
        public int YCoordinate { get; set; }
        public int ZCoordinate { get; set; }
        public int Scale { get; set; }
        public int Rotate { get; set; }
        public int XRotate { get; set; }
        public int YRotate { get; set; }
        public MediaItem BgImage { get; set; }
    }
}
