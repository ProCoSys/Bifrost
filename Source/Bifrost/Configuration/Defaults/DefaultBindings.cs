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
using Bifrost.Configuration.Assemblies;
using Bifrost.Execution;

namespace Bifrost.Configuration.Defaults
{
    /// <summary>
    /// Represents a <see cref="IDefaultBindings"/>
    /// </summary>
    public class DefaultBindings : IDefaultBindings
    {
        readonly IAssembliesConfiguration _assembliesConfiguration;
        readonly IAssemblyProvider _assemblyProvider;
        readonly IContractToImplementorsMap _contractToImplentorsMap;

        /// <summary>
        /// Initializes a new instance of <see cref="DefaultBindings"/>.
        /// </summary>
        public DefaultBindings(
            IAssembliesConfiguration assembliesConfiguration,
            IAssemblyProvider assemblyProvider,
            IContractToImplementorsMap contractToImplentorsMap)
        {
            _assembliesConfiguration = assembliesConfiguration;
            _assemblyProvider = assemblyProvider;
            _contractToImplentorsMap = contractToImplentorsMap;
        }

#pragma warning disable 1591 // Xml Comments
        public void Initialize(IContainer container)
        {
            container.Bind(container);
            container.Bind<_AppDomain>(AppDomain.CurrentDomain);
            container.Bind(_contractToImplentorsMap);
            container.Bind(_assembliesConfiguration);
            container.Bind(_assemblyProvider);
            container.Bind<IAssemblies>(typeof(Execution.Assemblies), BindingLifecycle.Singleton);
            container.Bind<ITypeDiscoverer>(typeof(TypeDiscoverer), BindingLifecycle.Singleton);
            container.Bind<ITypeFinder>(typeof(TypeFinder), BindingLifecycle.Singleton);
        }
#pragma warning restore 1591 // Xml Comments
    }
}