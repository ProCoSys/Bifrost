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
using Bifrost.Specifications;

namespace Bifrost.Configuration.Assemblies
{
    /// <summary>
    /// Provides extensions for <see cref="IAssemblyRuleBuilder"/>.
    /// </summary>
    public static class AssemblyRuleBuilderExtensions
    {
        /// <summary>
        /// Includes specified assemblies.
        /// </summary>
        /// <param name="assemblyBuilder"><see cref="IAssemblyBuilder"/> to build upon.</param>
        /// <param name="names">Names that assemblies should be starting with.</param>
        /// <returns>Chained <see cref="IAssemblyBuilder"/>.</returns>
        public static IAssemblyRuleBuilder IncludeAssembliesStartingWith(this IAssemblyRuleBuilder assemblyBuilder, params string[] names)
        {
            assemblyBuilder.Specification = assemblyBuilder.Specification.Or(new AssembliesStartingWith(names));
            return assemblyBuilder;
        }
    }
}
