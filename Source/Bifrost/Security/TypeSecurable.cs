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

namespace Bifrost.Security
{
    /// <summary>
    /// Represents a <see cref="Securable"/> that applies to a specific <see cref="System.Type"/>
    /// </summary>
    public class TypeSecurable : Securable
    {
        const string TYPE = "OfType_{{{0}}}";

        /// <summary>
        /// Initializes an instance of <see cref="TypeSecurable"/>
        /// </summary>
        /// <param name="type"><see cref="System.Type"/> to secure</param>
        public TypeSecurable(Type type) : base(string.Format(TYPE,type.FullName))
        {
            Type = type;
        }


        /// <summary>
        /// Gets the type that is secured
        /// </summary>
        public Type Type { get; private set; }

#pragma warning disable 1591
        public override bool CanAuthorize(object actionToAuthorize)
        {
            return actionToAuthorize!= null && Type == actionToAuthorize.GetType();
        }
#pragma warning restore 1591
    }
}
