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
using System.Linq;
using System.Text;
using Bifrost.CodeGeneration;
using Bifrost.CodeGeneration.JavaScript;
using Bifrost.Execution;
using Bifrost.Extensions;
using Bifrost.Web.Configuration;
using Bifrost.Web.Proxies;
using Microsoft.AspNet.SignalR;

namespace Bifrost.Web.Hubs
{
    public class HubProxies : IProxyGenerator
    {
        readonly ITypeDiscoverer _typeDiscoverer;
        readonly ICodeGenerator _codeGenerator;
        readonly WebConfiguration _configuration;

        public HubProxies(ITypeDiscoverer typeDiscoverer, ICodeGenerator codeGenerator, WebConfiguration configuration)
        {
            _typeDiscoverer = typeDiscoverer;
            _codeGenerator = codeGenerator;
            _configuration = configuration;
        }

        string ClientNamespace(string @namespace)
        {
            return _configuration.NamespaceMapper.GetClientNamespaceFrom(@namespace) ?? Namespaces.HUBS;
        }

        public string Generate()
        {
            var typesByNamespace = _typeDiscoverer
                .FindMultiple<Hub>()
                .OrderBy(t => t.FullName)
                .GroupBy(t => ClientNamespace(t.Namespace))
                .OrderBy(n => n.Key);
            var result = new StringBuilder();

            foreach (var @namespace in typesByNamespace)
            {
                var currentNamespace = _codeGenerator.Namespace(@namespace.Key);
                foreach (var type in @namespace)
                {
                    if (type.IsGenericType) continue;

                    var name = type.Name.ToCamelCase();

                    currentNamespace.Content.Assign(name)
                        .WithType(t =>
                            t.WithSuper("Bifrost.hubs.Hub")
                                .Function
                                    .Body
                                        .Variant("self", v => v.WithThis())
                                        .Property("_name", p => p.WithString(name))
                                        .WithServerMethodsFrom(type)
                        );
                }

                result.Append(_codeGenerator.GenerateFrom(currentNamespace));
            }

            return result.ToString();
        }
    }
}
