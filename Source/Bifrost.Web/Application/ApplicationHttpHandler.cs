#region License
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
using System;
using System.Text;
using System.Web;
using Bifrost.Configuration;
using Bifrost.Web.Assets;
using Bifrost.Web.Configuration;
using Bifrost.Web.Proxies;
using Bifrost.Web.Routing;
using Newtonsoft.Json;

namespace Bifrost.Web.Application
{
    public class ApplicationHttpHandler : IBifrostHttpHandler
    {
        private string _output;

        public bool IsReusable => true;
        
        private readonly WebConfiguration _webConfiguration;
        private readonly string _proxies;
        private readonly string _assets;

        public ApplicationHttpHandler() : this(Configure.Instance.Container.Get<WebConfiguration>())
        {
        }

        public ApplicationHttpHandler(WebConfiguration webConfiguration)
        {
            _webConfiguration = webConfiguration;
            _proxies = Configure.Instance.Container.Get<GeneratedProxies>().All;

            var assetsManager = Configure.Instance.Container.Get<IAssetsManager>();
            var files = assetsManager.GetFilesForExtension("js");
            var serializedAssets = JsonConvert.SerializeObject(files);

            _assets = $"Bifrost.assetsManager.initializeFromAssets({serializedAssets});";
        }

        public void ProcessRequest(HttpContext context)
        {
            if (_webConfiguration.ApplicationRouteCached)
            {
                if (string.IsNullOrEmpty(context.Request.Headers["If-Modified-Since"]))
                {
                    context.Response.Cache.SetAllowResponseInBrowserHistory(true);
                    context.Response.Cache.SetExpires(DateTime.Now.AddYears(10));
                    context.Response.Cache.SetCacheability(HttpCacheability.Private);

                    context.Response.Cache.VaryByHeaders["If-Modified-Since"] = true;
                    context.Response.Cache.VaryByHeaders["If-None-Match"] = true;
                    context.Response.Cache.SetETag(DateTime.Now.ToString());

                    context.Response.Cache.SetValidUntilExpires(true);

                    context.Response.Cache.SetNoServerCaching();
                    context.Response.Cache.SetLastModified(DateTime.MinValue);
                    OutputContent(context);
                }
                else
                {
                    context.Response.StatusCode = 304;
                    context.Response.StatusDescription = "Not Modified";
                }
            }
            else
            {
                OutputContent(context);
            }
        }

        void OutputContent(HttpContext context)
        {
            if (string.IsNullOrEmpty(_output))
            {
                var sb = new StringBuilder();
                sb.Append(_proxies);
                sb.Append(_assets);
                _output = sb.ToString();
            }
            
            context.Response.ContentType = "text/javascript";
            context.Response.Write(_output);
        }       
    }
}