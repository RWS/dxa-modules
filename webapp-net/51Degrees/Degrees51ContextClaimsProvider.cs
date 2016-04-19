using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Web;
using FiftyOne.Foundation.Mobile.Detection;
using FiftyOne.Foundation.Mobile.Detection.Entities.Stream;
using FiftyOne.Foundation.Mobile.Detection.Factories;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Context.Api.Types;

namespace Sdl.Web.Modules.Degrees51
{
    public class Degrees51ContextClaimsProvider : IContextClaimsProvider
    {       
        private IDictionary<string, object> _claims;     
        private Match _match;
        private IAspectMap[] _properties;
        private Dictionary<string, int> _context;
        public Degrees51ContextClaimsProvider()
        {                       
            // perform mapping of 51 degrees to context claims
            _properties = new IAspectMap[] 
            { 
               new AspectMap<string> { Aspect = "os", Name = "vendor", Build = ()=>GetProperty<string>("PlatformVendor") },
               new AspectMap<string> { Aspect = "os", Name = "model", Build = ()=>GetProperty<string>("PlatformName") },
               new AspectMap<GenericVersion> { Aspect = "os", Name = "version", Build = ()=> {
                   return new GenericVersion(0);
               } },
               new AspectMap<string> { Aspect = "userRequest", Name = "fullUrl", Build = ()=>"" },
               new AspectMap<bool> { Aspect = "ui", Name = "android", Build = ()=> {
                    string p = GetProperty<string>("PlatformVendor");
                    return p.Equals("android", StringComparison.InvariantCultureIgnoreCase);
               }},
               new AspectMap<bool> { Aspect = "ui", Name = "largeBrowser", Build = ()=> {
                    string p = GetProperty<string>("DeviceType");
                    return p.Equals("desktop", StringComparison.InvariantCultureIgnoreCase);
               }},
               new AspectMap<int> { Aspect = "browser", Name = "displayWidth", Build = ()=>GetContextProperty("dw") },
               new AspectMap<int> { Aspect = "browser", Name = "displayHeight", Build = ()=>GetContextProperty("dh") },
               new AspectMap<int> { Aspect = "browser", Name = "displayColorDepth", Build = ()=>GetContextProperty("bcd")},
               new AspectMap<bool> { Aspect = "browser", Name = "cookieSupport", Build = ()=>GetProperty<bool>("CookiesCapable") },
               new AspectMap<HashSet<string>> { Aspect = "browser", Name = "stylesheetSupport", Build = ()=> {
                   return new HashSet<string>();
               }},
               new AspectMap<HashSet<string>> { Aspect = "browser", Name = "inputModeSupport", Build = ()=> {
                   return new HashSet<string>{"useInputmodeAttribute"};
               }},
               new AspectMap<GenericVersion> { Aspect = "browser", Name = "jsVersion", Build = ()=> {
                   return new GenericVersion(0);
               }},
               new AspectMap<GenericVersion> { Aspect = "browser", Name = "cssVersion", Build = ()=> {
                   return new GenericVersion(0);
               }},
               new AspectMap<GenericVersion> { Aspect = "browser", Name = "version", Build = ()=> {
                   return new GenericVersion(0);
               }},
               new AspectMap<HashSet<string>> { Aspect = "browser", Name = "scriptSupport", Build = ()=> {
                   return new HashSet<string>();  
               }},
               new AspectMap<HashSet<string>> { Aspect = "browser", Name = "inputDevices", Build = ()=> {
                    return new HashSet<string>();  
               }},
               new AspectMap<HashSet<string>> { Aspect = "browser", Name = "imageFormatSupport", Build = ()=> {
                   return new HashSet<string>(); 
               }},
               new AspectMap<HashSet<string>> { Aspect = "browser", Name = "markupSupport", Build = ()=> {
                   return new HashSet<string>(); 
               }},
               new AspectMap<string> { Aspect = "browser", Name = "vendor", Build = ()=>GetProperty<string>("BrowserVendor") },
               new AspectMap<string> { Aspect = "browser", Name = "preferredHtmlContentType", Build = ()=>GetProperty<string>("") },
               new AspectMap<string> { Aspect = "browser", Name = "variant", Build = ()=>GetProperty<string>("") },
               new AspectMap<string> { Aspect = "browser", Name = "model", Build = ()=>GetProperty<string>("BrowserName") },
               new AspectMap<string> { Aspect = "browser", Name = "modelAndOS", Build = ()=>GetProperty<string>("") },
               new AspectMap<string> { Aspect = "userHttp", Name = "cacheControl", Build = ()=> "" },
               new AspectMap<string> { Aspect = "userServer", Name = "remoteUser", Build = ()=> "" },
               new AspectMap<string> { Aspect = "userServer", Name = "serverPort", Build = ()=> "" },
               new AspectMap<bool> { Aspect = "device", Name = "mobile", Build = ()=>GetProperty<bool>("IsMobile") },
               new AspectMap<bool> { Aspect = "device", Name = "robot", Build = ()=>GetProperty<bool>("IsCrawler") },
               new AspectMap<bool> { Aspect = "device", Name = "tablet", Build = ()=>GetProperty<bool>("IsTablet") },
               new AspectMap<bool> { Aspect = "device", Name = "4g", Build = ()=>false },
               new AspectMap<int> { Aspect = "device", Name = "displayHeight", Build = ()=>GetContextProperty("dh") },
               new AspectMap<int> { Aspect = "device", Name = "displayWidth", Build = ()=>GetContextProperty("dw") },
               new AspectMap<int> { Aspect = "device", Name = "pixelDensity", Build = ()=>{
                   // sqrt(ScreenPixelsHeight^2 + ScreenPixelsWidth^2) / ScreenInchesDiagonal

                   int w = GetProperty<int>("ScreenPixelsWidth");
                   int h = GetProperty<int>("ScreenPixelsHeight");
                   int d = GetProperty<int>("ScreenInchesDiagonal");
                   return (int)(Math.Sqrt(w * w + h * h) / d);
               }},
               new AspectMap<double> { Aspect = "device", Name = "pixelRatio", Build = ()=>{return 1.0;} },
               new AspectMap<GenericVersion> { Aspect = "device", Name = "version", Build = ()=>{
                   return new GenericVersion(0);
               }},
               new AspectMap<HashSet<string>> { Aspect = "device", Name = "inputDevices", Build = ()=> {
                   return new HashSet<string>();
               }},
               new AspectMap<string> { Aspect = "device", Name = "vendor", Build = ()=>GetProperty<string>("PlatformVender") },
               new AspectMap<string> { Aspect = "device", Name = "variant", Build = ()=>GetProperty<string>("DeviceType") },
               new AspectMap<string> { Aspect = "device", Name = "model", Build = ()=>GetProperty<string>("BrowserName") }
            };
        }

        public IDictionary<string, object> GetContextClaims(string aspectName)
        {                         
            if(_claims == null)
            {
                _claims = new Dictionary<string,object>();                         
                // grab all the properties from the data set and map to context claims
                // TODO: we should configure this location
                DataSet dataSet = StreamFactory.Create(Path.Combine(HttpContext.Current.Request.PhysicalApplicationPath, "App_Data\\51Degrees.dat"), false);
                Provider provider = new Provider(dataSet);
                _match = provider.Match(HttpContext.Current.Request.UserAgent);                
                foreach (IAspectMap x in _properties)
                {
                    AddAspectClaim(x.Aspect, x.Name, x.Value);
                }
            }          
            return _claims;
        }      

        public string GetDeviceFamily()
        {
            return null;
        }

        private int GetContextProperty(string propertyName)
        {
            if (_context == null)
            {
                _context = new Dictionary<string, int>();
                //context=dpr~1|dw~1600|dh~900|bcd~24|bw~1600|bh~775|version~1|; 
                HttpCookie cookie = HttpContext.Current.Request.Cookies["context"];
                if (cookie != null)
                {
                    string[] values = cookie.Value.Split(new char[] { '|' }, StringSplitOptions.RemoveEmptyEntries);
                    foreach (string s in values)
                    {
                        string[] v = s.Split(new char[] { '~' }, StringSplitOptions.RemoveEmptyEntries);
                        int i;
                        if (int.TryParse(v[1], out i))
                        {
                            _context.Add(v[0], i);
                        }
                    }
                }
            }

            return _context[propertyName];
        }

        private T GetProperty<T>(string propertyName)
        {
            var value = _match[propertyName];
            if (value == null) return default(T);           
            if (typeof(T) == typeof(bool))
                return (T)((object)value.ToBool());
            if (typeof(T) == typeof(int))
                return (T)((object)value.ToInt());
            if (typeof(T) == typeof(double))
                return (T)((object)value.ToDouble());
            if (typeof(T) == typeof(string))
                return (T)((object)value.ToString());           
            return default(T);
        }

        private void AddAspectClaim(string aspectName, string propertyName, object propertyValue)
        {
            string claimName = string.Format("{0}.{1}", aspectName, propertyName);
            _claims.Add(claimName, propertyValue);
        }

        private interface IAspectMap
        {
            string Aspect { get; set; }
            string Name { get; set; }
            Func<object> Build { get; set; }
            object Value { get; }
        }

        private class AspectMap<T> : IAspectMap
        {
            public string Aspect { get; set; }
            public string Name { get; set; }
            public Func<object> Build { get; set; }
            public object Value
            {
                get
                {
                    return ValueInternal;
                }
            }
            protected T ValueInternal
            {
                get
                {
                    if (Build != null)
                    {
                        object v = Build();
                        if (v != null)
                        {                            
                            if (v.GetType() == typeof(string))
                            {
                                string s = (string)v;
                                if (!string.IsNullOrEmpty(s))
                                {
                                    return (T)TypeDescriptor.GetConverter(typeof(T)).ConvertFromInvariantString(s);
                                }
                            }
                            else
                            {
                                return (T)v;
                            }
                        }
                    }
                    return default(T);
                }
            }
        }
    }
}
