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
using Bifrost.Configuration.Assemblies;

namespace Bifrost.Execution
{
    /// <summary>
    /// Specifies what assemblies to include or not.
    /// </summary>
    /// <remarks>
    /// Typically used by implementations of <see cref="IAssemblies"/> to
    /// get the correct assemblies located for things like implementations of
    /// <see cref="ITypeDiscoverer"/> which relies on knowing about assemblies
    /// to be able to discover types.
    /// </remarks>
    public interface ICanSpecifyAssemblies
    {
        /// <summary>
        /// Method that gets called for specifying which assemblies to include or not.
        /// </summary>
        /// <param name="configuration"><see cref="IAssembliesConfiguration"/> object to build specification on.</param>
        void Specify(IAssembliesConfiguration configuration);
    }
}
