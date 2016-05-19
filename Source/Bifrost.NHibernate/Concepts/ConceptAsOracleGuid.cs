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
using Bifrost.Concepts;
using Bifrost.NHibernate.UserTypes;

namespace Bifrost.NHibernate.Concepts
{
    /// <summary>
    /// NHibernate mapping of a custom user type that works in Oracle for a type T deriving from ConceptAs'Guid
    /// </summary>
    /// <typeparam name="T">The type that inherits from <see cref="ConceptAs{Guid}"/></typeparam>
    [Serializable]
    public class ConceptAsOracleGuid<T> : ConceptValueType<T, Guid>
        where T : ConceptAs<Guid>
    {
        static readonly OracleGuidMapping _oracleGuidMapping = new OracleGuidMapping();

        /// <summary>
        /// Creates an instance of <see cref="ConceptAsOracleGuid{T}"/>
        /// </summary>
        public ConceptAsOracleGuid()
            : base(_oracleGuidMapping)
        {
        }
    }
}
