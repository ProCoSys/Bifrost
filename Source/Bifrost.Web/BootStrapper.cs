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
using System.Collections.Generic;
using System.Web.Routing;
using Bifrost.Bootstrap;
using Bifrost.Configuration;
using Bifrost.Execution;
using Bifrost.Web.Resources;
using Bifrost.Web.Routing;
using Bifrost.Web.Services;
using Microsoft.Web.Infrastructure.DynamicModuleHelper;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(Bifrost.Web.BootStrapper), "PreApplicationStart")]
[assembly: WebActivatorEx.PostApplicationStartMethod(typeof(Bifrost.Web.BootStrapper), "Start")]

namespace Bifrost.Web
{
    public class BootStrapper
    {
        static volatile object _lockObject = new object();
        static bool _isInitialized;

        public static void PreApplicationStart()
        {
            DynamicModuleUtility.RegisterModule(typeof(HttpModule));
        }

        public static void Start()
        {
            lock (_lockObject)
            {
                if (_isInitialized)
                {
                    return;
                }

                var configure = Configure.DiscoverAndConfigure();
                var container = configure.Container;

                RegisterBifrostAssets();
                RegisterBifrostServices(container.Get<IImplementorFinder>().GetImplementorsFor(typeof(IBifrostService)));
                RegisterBifrostHttpHandlers(container.Get<IInstancesOf<IBifrostHttpHandler>>());

                _isInitialized = true;
            }
        }

        static void RegisterBifrostAssets()
        {
            RouteTable.Routes.AddResourcesFromAssembly("Bifrost", typeof(BootStrapper).Assembly);
        }

        static void RegisterBifrostServices(IEnumerable<Type> bifrostServices)
        {
            foreach (var service in bifrostServices)
            {
                RouteTable.Routes.AddService(service, "Bifrost");
            }
        }

        static void RegisterBifrostHttpHandlers(IEnumerable<IBifrostHttpHandler> bifrostHttpHandlers)
        {
            foreach (var httpHandler in bifrostHttpHandlers)
            {
                RouteTable.Routes.AddHttpHandler(httpHandler, "Bifrost");
            }
        }
    }
}
