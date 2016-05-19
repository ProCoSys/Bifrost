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
using Bifrost.Extensions;

namespace Bifrost.Execution
{
    /// <summary>
    /// Represents a <see cref="IBindingConventionManager"/>
    /// </summary>
    [Singleton]
    public class BindingConventionManager : IBindingConventionManager
    {
        readonly IContainer _container;
        readonly ITypeDiscoverer _typeDiscoverer;
        readonly List<Type> _conventions;

        /// <summary>
        /// Initializes a new instance <see cref="BindingConventionManager"/>.
        /// </summary>
        /// <param name="container">The <see cref="IContainer"/> that bindings are resolved to.</param>
        /// <param name="typeDiscoverer"><see cref="ITypeDiscoverer"/> to discover binding conventions with.</param>
        public BindingConventionManager(IContainer container, ITypeDiscoverer typeDiscoverer)
        {
            _container = container;
            _typeDiscoverer = typeDiscoverer;
            _conventions = new List<Type>();
        }

#pragma warning disable 1591 // Xml Comments
        public void Add(Type type)
        {
            if (!_conventions.Contains(type))
            {
                _conventions.Add(type);
            }
        }

        public void Add<T>() where T : IBindingConvention
        {
            Add(typeof(T));
        }

        public void Initialize()
        {
            var services = _typeDiscoverer.GetAll()
                .Except(_container.GetBoundServices())
                .ToList();

            foreach (var convention in _conventions.Select(_container.Get).Cast<IBindingConvention>())
            {
                var servicesToResolve = services
                    .Where(s => convention.CanResolve(_container, s))
                    .Where(s => !_container.HasBindingFor(s))
                    .ToList();

                foreach (var service in servicesToResolve)
                {
                    convention.Resolve(_container, service);
                    services.Remove(service);
                }
            }
        }

        public void DiscoverAndInitialize()
        {
            _typeDiscoverer.FindMultiple<IBindingConvention>().ForEach(Add);
            Initialize();
        }
#pragma warning restore 1591 // Xml Comments
    }
}
