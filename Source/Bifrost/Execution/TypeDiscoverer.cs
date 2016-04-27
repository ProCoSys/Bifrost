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
using Bifrost.Bootstrap;
using Bifrost.Bootstrap.Types;

namespace Bifrost.Execution
{
    /// <summary>
    /// Represents a <see cref="ITypeDiscoverer">ITypeDiscoverer</see>
    ///
    /// Uses the current AppDomain / Deployment and discoveres all types loaded
    /// </summary>
    [Singleton]
    public class TypeDiscoverer : ITypeDiscoverer
    {
        readonly ITypeCollector _typeCollector;
        readonly IImplementorFinder _implementorFinder;

        /// <summary>
        /// Initializes a new instance of <see cref="TypeDiscoverer">TypeDiscoverer</see>
        /// </summary>
        /// <param name="typeCollector"><see cref="ITypeCollector"/> for finding types from all collected types</param>
        /// <param name="implementorFinder"><see cref="IImplementorFinder"/> for keeping track of the relationship between contracts and implementors</param>
        public TypeDiscoverer(ITypeCollector typeCollector, IImplementorFinder implementorFinder)
        {
            _typeCollector = typeCollector;
            _implementorFinder = implementorFinder;
        }

#pragma warning disable 1591 // Xml Comments
        public IEnumerable<Type> GetAll()
        {
            return _typeCollector.Types;
        }

        public Type FindTypeByFullName(string fullName)
        {
            return _typeCollector.ByFullName(fullName);
        }

        public Type FindSingle<T>()
        {
            return _implementorFinder.GetImplementorFor(typeof(T));
        }

        public IEnumerable<Type> FindMultiple<T>()
        {
            return _implementorFinder.GetImplementorsFor(typeof(T));
        }

        public Type FindSingle(Type type)
        {
            return _implementorFinder.GetImplementorFor(type);
        }

        public IEnumerable<Type> FindMultiple(Type type)
        {
            return _implementorFinder.GetImplementorsFor(type);
        }
#pragma warning restore 1591 // Xml Comments
    }
}
