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

namespace Bifrost.Security
{
    /// <summary>
    /// Represents the result of an authorization of a <see cref="ISecurable"/>
    /// </summary>
    public class AuthorizeSecurableResult
    {
        readonly List<AuthorizeActorResult> _authorizationFailures = new List<AuthorizeActorResult>();

        /// <summary>
        /// Instantiates an instance of <see cref="AuthorizeSecurableResult"/> for the specificed <see cref="ISecurable"/>
        /// </summary>
        /// <param name="securable"><see cref="ISecurable"/> that this <see cref="AuthorizeSecurableResult"/> pertains to.</param>
        public AuthorizeSecurableResult(ISecurable securable)
        {
            Securable = securable;
        }

        /// <summary>
        /// Gets the <see cref="ISecurable"/> that this <see cref="AuthorizeSecurableResult"/> pertains to.
        /// </summary>
        public ISecurable Securable { get; private set; }

        /// <summary>
        /// Gets the <see cref="AuthorizeActorResult"/> for all failed <see cref="ISecurityActor"> Actors </see> on the <see cref="ISecurable"/>
        /// </summary>
        public IEnumerable<AuthorizeActorResult> AuthorizationFailures
        {
            get { return _authorizationFailures.AsEnumerable(); }
        }

        /// <summary>
        /// Processes an <see cref="AuthorizeActorResult"/> for an <see cref="ISecurityActor"> Actor</see>, adding it to the AuthorizationFailures collection if appropriate
        /// </summary>
        /// <param name="authorizeActorResult">Result to process</param>
        public void ProcessAuthorizeActorResult(AuthorizeActorResult authorizeActorResult)
        {
            if(!authorizeActorResult.IsAuthorized)
                _authorizationFailures.Add(authorizeActorResult);
        }

        /// <summary>
        /// Gets the result of the Authorization for the <see cref="ISecurable"/>
        /// </summary>
        public virtual bool IsAuthorized
        {
            get { return !AuthorizationFailures.Any(); }
        }

        /// <summary>
        /// Builds a collection of strings that show Securable/Actor for each broken or erroring rule in <see cref="AuthorizeSecurableResult"/>
        /// </summary>
        /// <returns>A collection of strings</returns>
        public virtual IEnumerable<string> BuildFailedAuthorizationMessages()
        {
            return from result in AuthorizationFailures from message in result.BuildFailedAuthorizationMessages() select Securable.Description + "/" + message;
        }
    }
}