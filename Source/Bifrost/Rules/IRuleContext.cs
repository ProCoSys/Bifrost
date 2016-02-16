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

namespace Bifrost.Rules
{


    /// <summary>
    /// Defines the context a rule can evaluate
    /// </summary>
    public interface IRuleContext
    {
        /// <summary>
        /// Register callback that gets called if there is a <see cref="IRule">rule</see> that fails
        /// </summary>
        /// <param name="callback"><see cref="RuleFailed"/> callback</param>
        void OnFailed(RuleFailed callback);

        /// <summary>
        /// Report a rule as failing
        /// </summary>
        /// <param name="rule"><see cref="IRule"/> to report</param>
        /// <param name="instance">The instance that was part of causing the problem</param>
        /// <param name="reason"><see cref="BrokeRuleReason">Reason</see> for it failing</param>
        void Fail(IRule rule, object instance, BrokenRuleReason reason);
    }
}
