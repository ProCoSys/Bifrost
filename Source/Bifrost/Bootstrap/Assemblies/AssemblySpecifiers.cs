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
using System.Linq;
using System.Reflection;
using Bifrost.Configuration.Assemblies;
using Bifrost.Extensions;

namespace Bifrost.Bootstrap.Assemblies
{
    /// <summary>
    /// Represents an implementation of <see cref="IAssemblySpecifiers"/>.
    /// </summary>
    public class AssemblySpecifiers : IAssemblySpecifiers
    {
        static readonly object LockObject = new object();

        readonly IAssembliesConfiguration _assembliesConfiguration;
        readonly ISet<string> _specifiedAssemblies;

        /// <summary>
        /// Initializes a new instance of <see cref="AssemblySpecifiers"/>.
        /// </summary>
        public AssemblySpecifiers(IAssembliesConfiguration assembliesConfiguration)
        {
            _assembliesConfiguration = assembliesConfiguration;
            _specifiedAssemblies = new HashSet<string>();
        }

#pragma warning disable 1591 // Xml Comments
        public bool SpecifyUsingSpecifiersFrom(Assembly assembly)
        {
            lock (LockObject)
            {
                if (_specifiedAssemblies.Contains(assembly.FullName))
                {
                    return false;
                }

                _specifiedAssemblies.Add(assembly.FullName);

                var specified = false;
                if (MayReferenceICanSpecifyAssemblies(assembly))
                {
                    assembly
                        .GetTypes()
                        .Where(t => t.GetInterfaces().Contains(typeof(ICanSpecifyAssemblies)))
                        .Where(type => type.HasDefaultConstructor())
                        .ForEach(type =>
                        {
                            var specifier = Activator.CreateInstance(type) as ICanSpecifyAssemblies;
                            specifier.Specify(_assembliesConfiguration);
                            specified = true;
                        });
                }

                return specified;
            }
        }

        static bool MayReferenceICanSpecifyAssemblies(Assembly assembly)
        {
            return assembly.FullName.Contains("Bifrost") ||
                   assembly.GetReferencedAssemblies().Any(a => a.FullName.Contains("Bifrost"));
        }
#pragma warning restore 1591 // Xml Comments
    }
}
