﻿#region License
//
// Copyright (c) 2008-2015, Dolittle (http://www.dolittle.com)
//
// Licensed under the MIT License (http://opensource.org/licenses/MIT)
//
// You may not use this file except in compliance with the License.
// You may obtain a copy of the license at
//
//   http://github.com/dolittle/Bifrost/blob/master/MIT-LICENSE.txt
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
#endregion
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using System.Web;
using Bifrost.Extensions;

namespace Bifrost.Web.Resources
{
    public class ResourcesHttpHandler : IHttpHandler
    {
        readonly string _url;
        readonly Assembly _assembly;
        readonly Dictionary<string, byte[]> _resources = new Dictionary<string, byte[]>();

        public ResourcesHttpHandler(string url, Assembly assembly)
        {
            _url = url;
            _assembly = assembly;
            foreach (var resource in _assembly.GetManifestResourceNames())
            {
                var stream = _assembly.GetManifestResourceStream(resource);
                var bytes = new byte[stream.Length];
                stream.Read(bytes, 0, bytes.Length);

                if (resource.ToLower().EndsWith(".html"))
                {
                    bytes = PrepareHtml(bytes);
                }

                var resourceName = GetRelativePathFromResourceName(resource);
                _resources[resourceName] = bytes;
            }
        }

        public bool IsReusable => false;

        public void ProcessRequest(HttpContext context)
        {
            var route = "/" + _url;
            var url = context.Request.Url.AbsolutePath;
            url = url.RemovePrefix(route);

            if (string.IsNullOrEmpty(url) || url == "/")
            {
                url = "index.html";
            }

            url = url
                .RemovePrefix("/")
                .Replace("/", ".")
                .Replace("-", "_")
                .ToLowerInvariant();

            if (!_resources.ContainsKey(url))
            {
                context.Response.StatusCode = 404;
                return;
            }

            if (url.EndsWith(".js"))
            {
                // Avoid application/x-javascript used by MimeMapping
                context.Response.ContentType = "application/javascript";
            }
            else
            {
                context.Response.ContentType = MimeMapping.GetMimeMapping(url) ?? "application/unknown";
            }

            context.Response.Cache.SetCacheability(HttpCacheability.NoCache);

            var bytes = _resources[url];
            context.Response.OutputStream.Write(bytes, 0, bytes.Length);
        }

        string GetRelativePathFromResourceName(string resourceName)
        {
            return resourceName
                .Replace(_assembly.GetName().Name + ".", string.Empty)
                .Replace("-", "_")
                .ToLowerInvariant();
        }

        byte[] PrepareHtml(byte[] bytes)
        {
            var html = Encoding.UTF8.GetString(bytes);
            var lines = html.Split('\n');

            var actualLines = new StringBuilder();
            foreach (var line in lines)
            {
                var actualLine = line;
                if (!line.Contains("href=\"#\"") && !line.Contains("href='#'"))
                {
                    actualLine = Replace("href", line, actualLine);
                }

                if (line.Contains("src="))
                {
                    actualLine = Replace("src", line, actualLine);
                }

                actualLines.Append(actualLine);
            }

            return Encoding.UTF8.GetBytes(actualLines.ToString());
        }

        string Replace(string attribute, string line, string actualLine)
        {
            if (line.Contains("<param name=\"source\" value=\""))
            {
                actualLine = actualLine.Replace("value=\"", "value=\"/" + _url + "/");
            }
            else
            {
                if (line.Contains(attribute + "=") &&
                    !line.Contains(attribute + "=\"http") &&
                    !line.Contains(attribute + "='http") &&
                    !line.Contains("signalr/hubs") )
                {
                    if (line.Contains(attribute + "=\"/") && line.Contains(attribute + "='/"))
                    {
                        actualLine = actualLine.Replace(attribute + "=\"/", attribute + "=\"/" + _url + "/");
                        actualLine = actualLine.Replace(attribute + "='/", attribute + "='/" + _url + "/");
                    }
                    else
                    {
                        actualLine = actualLine.Replace(attribute + "=\"", attribute + "=\"/" + _url + "/");
                        actualLine = actualLine.Replace(attribute + "='", attribute + "='/" + _url + "/");
                    }
                }
            }

            return actualLine;
        }
    }
}
