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

using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace Bifrost.Execution
{
    /// <summary>
    /// Defines a locator for locating assemblies for current application
    /// </summary>
    public interface IAssemblies
    {
        /// <summary>
        /// Gets all assemblies for current application
        /// </summary>
        /// <returns>Array of assemblies</returns>
        IEnumerable<_Assembly> GetAll();

        /// <summary>
        /// Gets an assembly for the current application by its fully qualified name 
        /// </summary>
        /// <param name="fullName">Fully qualified name of the assembly</param>
        /// <returns>Instance of the assembly, null if it was not found</returns>
        _Assembly GetWithFullName(string fullName);

        /// <summary>
        /// Gets an assembly based upon a friendly name of the assembly
        /// </summary>
        /// <param name="name">Name to get with</param>
        /// <returns>Instance of the assembly, null if it was not found</returns>
        _Assembly GetWithName(string name);
    }
}
