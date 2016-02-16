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
using System.Linq;
using Bifrost.Rules;

namespace Bifrost.Read.Validation
{
    /// <summary>
    /// Represents the result of query validation, typically done by <see cref="IQueryValidator"/>
    /// </summary>
    public class QueryValidationResult
    {
        /// <summary>
        /// Initializes an instance of <see cref="QueryValidationResult"/>
        /// </summary>
        /// <param name="brokenRules">Broken rules</param>
        public QueryValidationResult(IEnumerable<BrokenRule> brokenRules)
        {
            BrokenRules = brokenRules ?? new BrokenRule[0];
        }

        /// <summary>
        /// Gets all the broken rules
        /// </summary>
        public IEnumerable<BrokenRule> BrokenRules { get; private set; }

        /// <summary>
        /// Gets wether or not the validation was successful
        /// </summary>
        public bool Success { get { return BrokenRules.Count() == 0; } }
    }
}
