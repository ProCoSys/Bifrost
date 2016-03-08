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
using System.Linq;
using System.Reflection;
using Bifrost.Collections;

namespace Bifrost.Execution
{
    /// <summary>
    /// Represents an implementation of <see cref="ICanProvideAssemblies"/> that provides assemblies from the current <see cref="AppDomain"/>.
    /// </summary>
    public class AppDomainAssemblyProvider : ICanProvideAssemblies
    {
        /// <summary>
        /// Initializes a new instance of <see cref="AppDomainAssemblyProvider"/>
        /// </summary>
        public AppDomainAssemblyProvider()
        {
            AppDomain.CurrentDomain.AssemblyLoad += AssemblyLoaded;
            AvailableAssemblies = new ObservableCollection<AssemblyInfo>(
                AppDomain
                    .CurrentDomain
                    .GetAssemblies()
                    .Where(a => !a.IsDynamic)
                    .Select(AssemblyInfoFromAssembly));
        }

#pragma warning disable 1591 // Xml Comments
        public IObservableCollection<AssemblyInfo> AvailableAssemblies { get; }

#pragma warning restore 1591 // Xml Comments

        void AssemblyLoaded(object sender, AssemblyLoadEventArgs args)
        {
            var assembly = args.LoadedAssembly;
            if (!assembly.IsDynamic)
            {
                AvailableAssemblies.Add(AssemblyInfoFromAssembly(assembly));
            }
        }

        static AssemblyInfo AssemblyInfoFromAssembly(Assembly assembly)
        {
            return new AssemblyInfo(assembly.GetName().Name, assembly.Location, new Lazy<Assembly>(() => assembly));
        }
    }
}
