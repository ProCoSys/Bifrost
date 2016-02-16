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
using Bifrost.Security;

namespace Bifrost.Read
{
    /// <summary>
    /// Represents an implementation of <see cref="IFetchingSecurityManager"/>
    /// </summary>
    public class FetchingSecurityManager : IFetchingSecurityManager
    {
        ISecurityManager _securityManager;

        /// <summary>
        /// Initializes a new instance of <see cref="FetchingSecurityManager"/>
        /// </summary>
        /// <param name="securityManager"><see cref="ISecurityManager"/> for forwarding requests related to security to</param>
        public FetchingSecurityManager(ISecurityManager securityManager)
        {
            _securityManager = securityManager;
        }

#pragma warning disable 1591 // Xml Comments
        public AuthorizationResult Authorize<T>(IReadModelOf<T> readModelOf) where T : IReadModel
        {
            return _securityManager.Authorize<Fetching>(readModelOf);
        }

        public AuthorizationResult Authorize(IQuery query)
        {
            return _securityManager.Authorize<Fetching>(query);
        }

        public AuthorizationResult Authorize<T>(IQueryFor<T> queryFor) where T : IReadModel
        {
            return _securityManager.Authorize<Fetching>(queryFor);
        }
#pragma warning restore 1591 // Xml Comments
    }
}
