using Newtonsoft.Json;
using Sdl.Web.Tridion.Common;
using System;
using System.Xml;
using Tridion.ContentManager;
using Tridion.ContentManager.ContentManagement;
using Tridion.ContentManager.Templating;
using Tridion.ContentManager.Templating.Assembly;
using Tridion.ExternalContentLibrary.V2;

namespace Sdl.Web.Tridion.Templates
{
    /// <summary>
    /// Resolves ECL items from the package output.
    /// Update URL tags with the External URL if available so these can be used directly by the web application. 
    /// </summary>
    /// <remarks>
    /// Should be placed after the "Publish binaries for component" TBB
    /// </remarks>
    [TcmTemplateTitle("Resolve External Content Library Items")]
    [TcmTemplateParameterSchema("resource:Sdl.Web.Tridion.Resources.ResolveEclItemsParameters.xsd")]
    public class ResolveEclItems : TemplateBase, IDisposable
    {
        private IEclSession _eclSession;

        public override void Transform(Engine engine, Package package)
        {
            Initialize(engine, package);
            Component comp = GetComponent();
            if (IsPageTemplate() || comp == null)
            {
                Logger.Error("No Component found (is this a Page Template?)");
                return;
            }

            Item outputItem = package.GetByName(Package.OutputName);
            if (outputItem == null)
            {
                Logger.Error("No Output package item found (is this TBB placed at the end?)");
                return;
            }
            string output = outputItem.GetAsString();
            if (outputItem.ContentType.Equals(ContentType.Xml))
            {
                Logger.Debug("Content is XML");
                //XML - only for backwards compatibility
                XmlDocument xmlDocument;
                if (ResolveXmlContent(output, out xmlDocument))
                {
                    package.Remove(outputItem);
                    package.PushItem(Package.OutputName, package.CreateXmlDocumentItem(ContentType.Xml, xmlDocument));
                }
            }
            else
            {
                Logger.Debug("Content is JSON");
                //JSON
                string json;
                if (ResolveJsonContent(output, out json))
                {
                    package.Remove(outputItem);
                    package.PushItem(Package.OutputName, package.CreateStringItem(ContentType.Text, json));
                }
            }
        }

        public void Dispose()
        {
            if (_eclSession != null)
            {
                _eclSession.Dispose();
                _eclSession = null;
            }
        }

        private bool ResolveJsonContent(string content, out string json)
        {
            json = content;

            XmlDocument xmlDocument = JsonConvert.DeserializeXmlNode(json, "Component", true);
            bool containsEclReferences = ResolveContentDocument(xmlDocument);
            if (containsEclReferences)
            {
                json = JsonConvert.SerializeXmlNode(xmlDocument, Newtonsoft.Json.Formatting.None, true);
            }

            return containsEclReferences;
        }

        private bool ResolveXmlContent(string content, out XmlDocument xmlDocument)
        {
            xmlDocument = new XmlDocument();
            xmlDocument.LoadXml(content);

            return ResolveContentDocument(xmlDocument);
        }

        private bool ResolveContentDocument(XmlDocument xmlDocument)
        {
            bool containsEclReferences = false;

            XmlNodeList multimediaComponentElements = xmlDocument.SelectNodes("//Multimedia[MimeType='application/externalcontentlibrary']/..");

            Logger.Debug(String.Format("Resolving {0} External Content Library reference(s)", multimediaComponentElements.Count));

            foreach (XmlElement multimediaComponentElement in multimediaComponentElements)
            {
                ResolveEclReference(multimediaComponentElement);
                containsEclReferences = true;
            }

            return containsEclReferences;
        }

        private void ResolveEclReference(XmlElement multimediaComponentElement)
        {
            Logger.Debug(String.Format("Multimedia Component XML [{0}]", multimediaComponentElement.OuterXml));

            XmlNode idNode = multimediaComponentElement.SelectSingleNode("Id");
            if (idNode != null)
            {
                string tcmUri = idNode.InnerText;
                if (!String.IsNullOrEmpty(tcmUri))
                {
                    Logger.Debug(String.Format("Multimedia Component Id: {0}", tcmUri));
                    XmlNode urlNode = multimediaComponentElement.SelectSingleNode("Multimedia/Url");
                    if (urlNode != null)
                    {
                        IEclUri eclUri = TryGetEclUriFromTcmUri(tcmUri);
                        if (eclUri != null)
                        {
                            // we can add an ECLURI element, but DD4T will not copy it to the Page output, so we can't use this right now
                            //XmlElement eclUriElement = multimediaComponentElement.OwnerDocument.CreateElement("EclUri");
                            //eclUriElement.InnerText = eclUri.ToString();
                            //multimediaComponentElement.AppendChild(eclUriElement);

                            // TODO: should we consider using the template fragment somehow?
                            // TODO: direct link could be null, then content is available and we should add a binary to the package and publish that
                            // in case of the latter, shouldn't this be handled in the DD4T Publish binaries for component TBB? 
                            string directLink = GetExternalContentLibraryDirectLink(eclUri);
                            Logger.Debug(String.Format("ECL direct link: {0}", directLink));
                            Logger.Debug(String.Format("ECL URI: {0}", eclUri));
                            Logger.Debug(String.Format("ECL template fragment: {0}", GetExternalContentLibraryHtmlFragment(eclUri)));
                            urlNode.InnerText = directLink;

                            // Media Manager doesn't specify a mimetype for its distributions, which is a shame, so lets keep it the default ECL mimetype
                            // we can find a mimetype in the external metadata for the asset, but there could be multiple assets in a distribution
                            // plus Media Manager will actually change the mimetype depending on what device is requesting the video, so it should remain unknown at this point
                            //XmlNode mimeTypeNode = multimediaComponentElement.SelectSingleNode("Multimedia/MimeType");
                            //if (mimeTypeNode != null)
                            //{
                            //    mimeTypeNode.InnerText = GetExternalContentLibraryMimeType(eclUri);
                            //    Logger.Debug(String.Format("ECL mimetype: {0}", mimeTypeNode.InnerText));
                            //}

                            // TODO: this should all be moved to DD4T Publish binaries for component TBB and expose additional information about the ECL item (including external metadata)
                        }
                    }            
                }
            }
        }

        private string GetExternalContentLibraryMimeType(IEclUri eclUri)
        {
            if (_eclSession == null)
            {
                _eclSession = SessionFactory.CreateEclSession(Engine.GetSession());
            }

            if (eclUri == null || eclUri.IsNullUri)
            {
                throw new ArgumentException(string.Format("The URI {0} is not an External Content Library stub Component", eclUri));
            }

            var item = _eclSession.GetContentLibrary(eclUri).GetItem(eclUri) as IContentLibraryMultimediaItem;
            return item == null ? null : item.MimeType;
        }

        private string GetExternalContentLibraryHtmlFragment(IEclUri eclUri)
        {
            if (_eclSession == null)
            {
                _eclSession = SessionFactory.CreateEclSession(Engine.GetSession());
            }

            if (eclUri == null || eclUri.IsNullUri)
            {
                throw new ArgumentException(string.Format("The URI {0} is not an External Content Library stub Component", eclUri));
            }

            var item = _eclSession.GetContentLibrary(eclUri).GetItem(eclUri) as IContentLibraryMultimediaItem;
            return item == null ? null : item.GetTemplateFragment(null);
        }

        private string GetExternalContentLibraryDirectLink(IEclUri eclUri)
        {
            if (_eclSession == null)
            {
                _eclSession = SessionFactory.CreateEclSession(Engine.GetSession());
            }

            if (eclUri == null || eclUri.IsNullUri)
            {
                throw new ArgumentException(string.Format("The URI {0} is not an External Content Library stub Component", eclUri));
            }

            var item = _eclSession.GetContentLibrary(eclUri).GetItem(eclUri) as IContentLibraryMultimediaItem;
            return item == null ? null : item.GetDirectLinkToPublished(null);
        }

        private IEclUri TryGetEclUriFromTcmUri(string tcmUri)
        {
            if (!TcmUri.IsValid(tcmUri))
            {
                Logger.Warning("Can not determine if the URI '{0}' represents an External Content Library stub Component as it is not a valid TCM URI");
                return null;
            }

            TcmUri uri = new TcmUri(tcmUri);
            if (uri.IsUriNull)
            {
                Logger.Debug("TryGetEclUriFromTcmUri called with a NULL TCM URI - this will always resolve to null");
                return null;

            }

            if (_eclSession == null)
            {
                _eclSession = SessionFactory.CreateEclSession(Engine.GetSession());
            }

            IEclUri eclUri = _eclSession.TryGetEclUriFromTcmUri(uri.ToString());
            return eclUri;
        }
    }
}
