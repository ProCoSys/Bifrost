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
using System.Reflection;
using System.Web.Routing;
using Bifrost.Web.Services;

namespace Bifrost.Web.Resources
{
    public static class RouteExtensions
    {
        /// <summary>
        /// Adds routing to all embedded resources within an assembly.
        /// </summary>
        /// <param name="routes">The route collection to add the route to.</param>
        /// <param name="path">The path to add.</param>
        /// <param name="assembly">The assembly to scan for resources.</param>
        /// <remarks>
        /// In order to avoid searching for static content from disk, the following line must be added to the system.webServer/handlers section of web.config:
        /// &lt;add name="nostaticfile" path="$path/*" verb="GET" type="System.Web.Handlers.TransferRequestHandler" preCondition="integratedMode" /&gt;
        ///
        /// Due to the way .NET handles resources, '.' in filenames will be converted to '/'. So a resource named /Foo/file.with.dots.txt will
        /// be hosted under /path/foo/file/with/dots.txt.
        /// </remarks>
        public static void AddResourcesFromAssembly(this RouteCollection routes, string path, Assembly assembly)
        {
            routes.AddHttpHandler(new ResourcesHttpHandler(path, assembly), path, true);
        }
    }
}
