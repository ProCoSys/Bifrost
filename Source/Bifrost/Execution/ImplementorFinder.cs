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
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bifrost.Bootstrap;
using Bifrost.Conventions;
using Bifrost.Extensions;

namespace Bifrost.Execution
{
    /// <summary>
    /// Represents an implementation of <see cref="IImplementorFinder"/>
    /// </summary>
    public class ImplementorFinder : IImplementorFinder, ICollectTypes
    {
        readonly ConcurrentDictionary<Type, ConcurrentDictionary<string, Type>> _contractsAndImplementors =
            new ConcurrentDictionary<Type, ConcurrentDictionary<string, Type>>();

#pragma warning disable 1591 // Xml Comments
        public void Feed(ICollection<Type> types)
        {
            FeedTypes(types);
        }

        public IEnumerable<Type> GetImplementorsFor(Type contract)
        {
            return GetImplementingTypesFor(contract).Values;
        }

        public Type GetImplementorFor(Type contract)
        {
            var implementingTypes = GetImplementingTypesFor(contract).Values;
            ThrowIfMultipleTypesFound(contract, implementingTypes);
            return implementingTypes.FirstOrDefault();
        }
#pragma warning restore 1591 // Xml Comments

        void FeedTypes(IEnumerable<Type> types)
        {
            var implementors = types.Where(t => t.IsImplementation());
            Parallel.ForEach(
                implementors,
                implementor =>
                {
                    var baseAndImplementingTypes = implementor.AllBaseAndImplementingTypes();
                    baseAndImplementingTypes.ForEach(contract => GetImplementingTypesFor(contract)[GetKeyFor(implementor)] = implementor);
                });
        }

        ConcurrentDictionary<string, Type> GetImplementingTypesFor(Type contract)
        {
            return _contractsAndImplementors.GetOrAdd(contract, key => new ConcurrentDictionary<string, Type>());
        }

        static string GetKeyFor(Type type)
        {
            return type.AssemblyQualifiedName;
        }

        static void ThrowIfMultipleTypesFound(Type type, ICollection<Type> typesFound)
        {
            if (typesFound.Count > 1)
            {
                throw new MultipleTypesFoundException(
                    string.Format(ExceptionStrings.MultipleTypesFoundException, type.FullName));
            }
        }
    }
}
