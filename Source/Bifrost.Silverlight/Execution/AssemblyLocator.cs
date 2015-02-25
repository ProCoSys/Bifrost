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
using System.Linq;
using System.Reflection;
using System.Windows;

namespace Bifrost.Execution
{
    /// <summary>
    /// Represents a <see cref="IAssemblyLocator"/>
    /// </summary>
    [Singleton]
    public class AssemblyLocator : IAssemblyLocator
    {
        Assembly[] _assemblies;

        /// <summary>
        /// Initializes a new instance of <see cref="AssemblyLocator"/>
        /// </summary>
        public AssemblyLocator()
        {
            Initialize();
        }

        private void Initialize()
        {
            _assemblies = (from part in Deployment.Current.Parts
                           where ShouldAddAssembly(part.Source)
                           let info = Application.GetResourceStream(new Uri(part.Source, UriKind.Relative))
                           select part.Load(info.Stream)).ToArray();
        }

#pragma warning disable 1591 // Xml Comments
        public Assembly[] GetAll()
        {
            return _assemblies;
        }

        public Assembly GetWithFullName(string fullName)
        {
            var query = from a in _assemblies
                        where a.FullName == fullName
                        select a;

            var assembly = query.SingleOrDefault();
            return assembly;
        }

        public Assembly GetWithName(string name)
        {
            var query = from a in _assemblies
                        where a.FullName.Contains(name)
                        select a;

            var assembly = query.SingleOrDefault();
            return assembly;
        }

#pragma warning restore 1591 // Xml Comments

        static bool ShouldAddAssembly(string name)
        {
            return !name.Contains("System.");
        }
    }
}