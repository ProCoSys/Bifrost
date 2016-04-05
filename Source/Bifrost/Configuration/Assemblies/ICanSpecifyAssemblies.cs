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
using Bifrost.Conventions;

namespace Bifrost.Configuration.Assemblies
{
    /// <summary>
    /// Specifies what assemblies to include or not.
    /// </summary>
    /// <remarks>
    /// Types inheriting from this interface will be automatically registered.
    /// An application can implement any number of these conventions.
    /// Implementing classes must have a default constructor.
    /// </remarks>
    public interface ICanSpecifyAssemblies : IConvention
    {
        /// <summary>
        /// Method that gets called for specifying which assemblies to include or not.
        /// </summary>
        /// <param name="configuration"><see cref="IAssembliesConfiguration"/> object to build specification on.</param>
        void Specify(IAssembliesConfiguration configuration);
    }
}
