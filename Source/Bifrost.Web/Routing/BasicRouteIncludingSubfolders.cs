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
using System.Web;
using System.Web.Routing;
using Bifrost.Configuration;

namespace Bifrost.Web.Routing
{
    public class BasicRouteIncludingSubfolders : Route
    {
        private const string UnmatchedPathSegment = "{*pathInfo}";

        public BasicRouteIncludingSubfolders(Type httpHandler, string url)
            : base($"{url}/{UnmatchedPathSegment}", new BasicRouteHandler(InitializeFromContainer(httpHandler)))
        {
        }

        public BasicRouteIncludingSubfolders(IHttpHandler httpHandler, string url)
            : base($"{url}/{UnmatchedPathSegment}", new BasicRouteHandler(new Lazy<IHttpHandler>(() => httpHandler)))
        {
        }

        public override VirtualPathData GetVirtualPath(RequestContext requestContext, RouteValueDictionary values)
        {
            return null;
        }

        private static Lazy<IHttpHandler> InitializeFromContainer(Type httpHandler)
        {
            return new Lazy<IHttpHandler>(() => (IHttpHandler)Configure.Instance.Container.Get(httpHandler));
        }
    }
}
