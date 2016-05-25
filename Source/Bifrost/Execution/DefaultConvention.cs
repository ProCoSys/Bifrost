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
using System.Linq;
using Bifrost.Bootstrap;
using Bifrost.Extensions;

namespace Bifrost.Execution
{
    /// <summary>
    /// Represents a <see cref="IBindingConvention">IBindingConvention</see>
    /// that will apply default conventions.
    /// </summary>
    /// <remarks>
    /// Any interface being resolved and is prefixed with 'I' and have an implementation
    /// with the same name in the same namespace but without the prefix 'I', will automatically
    /// be resolved with this convention.
    /// </remarks>
    public class DefaultConvention : BaseConvention
    {
        readonly IImplementorFinder _implementorFinder;

        /// <summary>
        /// Initializes a new instance of <see creF="DefaultConvention">DefaultConvention</see>.
        /// </summary>
        public DefaultConvention(IImplementorFinder implementorFinder)
        {
            DefaultScope = BindingLifecycle.Transient;
            _implementorFinder = implementorFinder;
        }

#pragma warning disable 1591 // Xml Comments
        public override bool CanResolve(IContainer container, Type service)
        {
            var type = GetServiceInstanceType(service);
            return type != null && !container.HasBindingFor(type);
        }

        public override void Resolve(IContainer container, Type service)
        {
            var serviceInstanceType = GetServiceInstanceType(service);
            if (serviceInstanceType != null)
            {
                var scope = GetScopeForTarget(serviceInstanceType);
                container.Bind(service, serviceInstanceType, scope);
            }
        }
#pragma warning restore 1591 // Xml Comments

        Type GetServiceInstanceType(Type service)
        {
            var serviceName = service.Name;
            if (!serviceName.StartsWith("I"))
            {
                return null;
            }

            var instanceName = $"{service.Namespace}.{serviceName.Substring(1)}";
            var serviceInstanceType = service.Assembly.GetType(instanceName);
            if (null != serviceInstanceType &&
                IsAssignableFrom(service, serviceInstanceType) &&
                !HasMultipleImplementationInSameNamespace(service) &&
                !serviceInstanceType.HasAttribute<IgnoreDefaultConventionAttribute>())
            {
                return serviceInstanceType.IsAbstract ? null : serviceInstanceType;
            }

            return null;
        }

        bool HasMultipleImplementationInSameNamespace(Type service)
        {
            var implementationsCount = _implementorFinder
                .GetImplementorsFor(service)
                .Where(t => !string.IsNullOrEmpty(t.Namespace) && t.Namespace.Equals(service.Namespace))
                .Count();
            return implementationsCount > 1;
        }

        static bool IsAssignableFrom(Type service, Type serviceInstanceType)
        {
            if (service.IsAssignableFrom(serviceInstanceType))
            {
                return true;
            }

            return serviceInstanceType
                .GetInterfaces()
                .Where(t => t.Name == service.Name && t.Namespace == service.Namespace)
                .Count() == 1;
        }
    }
}
