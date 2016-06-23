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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Routing;
using Bifrost.Bootstrap;
using Bifrost.Configuration;
using Bifrost.Execution;
using Bifrost.JSON.Concepts;
using Bifrost.Web.Resources;
using Bifrost.Web.Routing;
using Bifrost.Web.Services;
using Bifrost.Web.SignalR;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using Owin;

namespace Bifrost.Web
{
    public class Configurator : ICanConfigure
    {
        public void Configure(IConfigure configure)
        {
            configure.CallContext.WithCallContextTypeOf<WebCallContext>();
            var container = configure.Container;

            ConfigureSignalR(configure.Container);

            RegisterBifrostAssets();
            RegisterBifrostServices(container.Get<IImplementorFinder>().GetImplementorsFor(typeof(IBifrostService)));
            RegisterBifrostHttpHandlers(container.Get<IInstancesOf<IBifrostHttpHandler>>());
        }

        void ConfigureSignalR(IContainer container)
        {
            var resolver = new BifrostDependencyResolver(container);

            var serializerSettings = new JsonSerializerSettings
            {
                ContractResolver = new FilteredCamelCasePropertyNamesContractResolver(),
                Converters = { new ConceptConverter(), new ConceptDictionaryConverter() }
            };
            var jsonSerializer = JsonSerializer.Create(serializerSettings);
            resolver.Register(typeof(JsonSerializer), () => jsonSerializer);

            GlobalHost.DependencyResolver = resolver;

            var hubConfiguration = new HubConfiguration { Resolver = resolver };

            RouteTable.Routes.MapOwinPath("/signalr", a => a.RunSignalR(hubConfiguration));
            var route = RouteTable.Routes.Last();
            RouteTable.Routes.Remove(route);
            RouteTable.Routes.AddFirst(route);
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
