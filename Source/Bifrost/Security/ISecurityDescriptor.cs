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

namespace Bifrost.Security
{
    /// <summary>
    /// Defines a security descriptor
    /// </summary>
    public interface ISecurityDescriptor
    {
        /// <summary>
        /// Get the entry point for builidng a <see cref="ISecurityDescriptor"/>
        /// </summary>
        ISecurityDescriptorBuilder When { get; }

        /// <summary>
        /// Add a <see cref="ISecurityAction"/> to the <see cref="ISecurityDescriptor"/>
        /// </summary>
        /// <param name="securityAction"><see cref="ISecurityAction"/> to add</param>
        void AddAction(ISecurityAction securityAction);

        /// <summary>
        /// Get the <see cref="ISecurityAction">action builders</see>
        /// </summary>
        IEnumerable<ISecurityAction> Actions { get; }

        /// <summary>
        /// Indicates whether this security descriptor can authorize this particular object
        /// </summary>
        /// <typeparam name="T">The type of <see cref="ISecurityAction"/> that we wish to authorize</typeparam>
        /// <param name="instanceToAuthorize">Instance of the object that we wish to authorize</param>
        /// <returns>True if this descriptor can authorize, False otherwise</returns>
        bool CanAuthorize<T>(object instanceToAuthorize) where T : ISecurityAction;

        /// <summary>
        /// Authorizes an object that represents a particular action being undertaken
        /// </summary>
        /// <param name="instanceToAuthorize">instance of the action being undertaken</param>
        /// <returns>An <see cref="AuthorizeDescriptorResult"/> indicating the result of the authorization attempt</returns>
        AuthorizeDescriptorResult Authorize(object instanceToAuthorize);
    }
}
