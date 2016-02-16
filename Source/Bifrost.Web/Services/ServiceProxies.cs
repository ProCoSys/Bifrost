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
using Bifrost.CodeGeneration;
using Bifrost.CodeGeneration.JavaScript;
using Bifrost.Extensions;
using Bifrost.Web.Proxies;

namespace Bifrost.Web.Services
{
    public class ServiceProxies : IProxyGenerator
    {
        ICodeGenerator _codeGenerator;
        IRegisteredServices _registeredServices;


        public ServiceProxies(IRegisteredServices registeredServices, ICodeGenerator codeGenerator)
        {
            _codeGenerator = codeGenerator;
            _registeredServices = registeredServices;
        }


        public string Generate()
        {
            var serviceRegistrations = _registeredServices.GetAll();
            var ns = _codeGenerator.Namespace("services",
                o =>
                {
                    foreach (var serviceRegistration in serviceRegistrations)
                    {
                        var name = serviceRegistration.Key.Name.ToCamelCase();
                        o.Assign(name)
                            .WithType(t =>
                                t.WithSuper("Bifrost.services.Service")
                                    .Function
                                        .Body
                                            .Variant("self", v => v.WithThis())
                                            .Property("name", p => p.WithString(name))
                                            .Property("url", p=> p.WithString(serviceRegistration.Value))
                                            .WithServiceMethodsFrom(serviceRegistration.Key));
                    }
                });

            var result = _codeGenerator.GenerateFrom(ns);
            return result;

        }
    }
}
