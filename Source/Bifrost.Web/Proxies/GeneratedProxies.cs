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
using System.Linq;
using System.Text;
using Bifrost.Execution;
using Bifrost.Web.Commands;
using Bifrost.Web.Configuration;
using Bifrost.Web.Hubs;
using Bifrost.Web.Read;
using Bifrost.Web.Services;

namespace Bifrost.Web.Proxies
{
    [Singleton]
    public class GeneratedProxies
    {
        public string All { get; }

        public GeneratedProxies(
            CommandProxies commandProxies,
            QueryProxies queryProxies,
            ReadModelProxies readModelProxies,
            ServiceProxies serviceProxies,
            NamespaceConfigurationProxies namespaceConfigurationProxies,
            HubProxies hubProxies,
            ITypeDiscoverer typeDiscoverer,
            IContainer container)
        {
            var builder = new StringBuilder();
            builder.Append(commandProxies.Generate());
            builder.Append(readModelProxies.Generate());
            builder.Append(queryProxies.Generate());
            builder.Append(serviceProxies.Generate());
            builder.Append(namespaceConfigurationProxies.Generate());
            builder.Append(hubProxies.Generate());

            var generatorTypes = typeDiscoverer.FindMultiple<IProxyGenerator>().Where(t => !t.Namespace.StartsWith("Bifrost"));
            foreach (var generator in generatorTypes.Select(container.Get).Cast<IProxyGenerator>())
            {
                builder.Append(generator.Generate());
            }

            All = builder.ToString();
        }
    }
}
