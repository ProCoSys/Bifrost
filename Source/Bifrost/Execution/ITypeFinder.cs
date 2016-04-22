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

namespace Bifrost.Execution
{
    /// <summary>
    /// Defines a system that is capable of finding types based on base types
    /// </summary>
    public interface ITypeFinder
    {
        /// <summary>
        /// Find a single implementation of a basetype
        /// </summary>
        /// <param name="types">Types to find from</param>
        /// <typeparam name="T">Basetype to find for</typeparam>
        /// <returns>Type found</returns>
        /// <remarks>
        /// If the base type is an interface, it will look for any types implementing the interface.
        /// If it is a class, it will find anyone inheriting from that class
        /// </remarks>
        /// <exception cref="ArgumentException">If there is more than one instance found</exception>
        Type FindSingle<T>(IImplementorFinder types);

        /// <summary>
        /// Find multiple implementations of a basetype
        /// </summary>
        /// <param name="types">Types to find from</param>
        /// <typeparam name="T">Basetype to find for</typeparam>
        /// <returns>All types implementing or inheriting from the given basetype</returns>
        /// <remarks>
        /// If the base type is an interface, it will look for any types implementing the interface.
        /// If it is a class, it will find anyone inheriting from that class
        /// </remarks>
        IEnumerable<Type> FindMultiple<T>(IImplementorFinder types);

        /// <summary>
        /// Find a single implementation of a basetype
        /// </summary>
        /// <param name="types">Types to find from</param>
        /// <param name="type">Basetype to find for</param>
        /// <returns>Type found</returns>
        /// <remarks>
        /// If the base type is an interface, it will look for any types implementing the interface.
        /// If it is a class, it will find anyone inheriting from that class
        /// </remarks>
        /// <exception cref="ArgumentException">If there is more than one instance found</exception>
        Type FindSingle(IImplementorFinder types, Type type);

        /// <summary>
        /// Find multiple implementations of a basetype
        /// </summary>
        /// <param name="types">Types to find from</param>
        /// <param name="type">Basetype to find for</param>
        /// <returns>All types implementing or inheriting from the given basetype</returns>
        /// <remarks>
        /// If the base type is an interface, it will look for any types implementing the interface.
        /// If it is a class, it will find anyone inheriting from that class
        /// </remarks>
        IEnumerable<Type> FindMultiple(IImplementorFinder types, Type type);

        /// <summary>
        /// Find a single type using the full name, without assembly
        /// </summary>
        /// <param name="types">Types to find from</param>
        /// <param name="fullName">full name of the type to find</param>
        /// <returns>The type is found, null otherwise</returns>
        Type FindTypeByFullName(IImplementorFinder types, string fullName);
    }
}
