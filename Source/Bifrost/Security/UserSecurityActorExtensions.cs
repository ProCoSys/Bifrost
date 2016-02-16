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
using System.Linq;
using System.Text;

namespace Bifrost.Security
{
    /// <summary>
    /// Extensions for <see cref="UserSecurityActor"/>
    /// </summary>
    public static class UserSecurityActorExtensions
    {
        /// <summary>
        /// Declares that the <see cref="UserSecurityActor"/> must be in a specific role
        /// </summary>
        /// <param name="securityActor"><see cref="UserSecurityActor"/> to declare it for</param>
        /// <param name="role">Role</param>
        /// <returns><see cref="UserSecurityActor"/> to continue the chain with</returns>
        public static UserSecurityActor MustBeInRole(this UserSecurityActor securityActor, string role)
        {
            securityActor.AddRule(new RoleRule(securityActor,role));
            return securityActor;
        }

        /// <summary>
        /// Declares that the <see cref="UserSecurityActor"/> must be in set of specific roles
        /// </summary>
        /// <param name="securityActor"><see cref="UserSecurityActor"/> to declare it for</param>
        /// <param name="roles">Roles to specify</param>
        /// <returns><see cref="UserSecurityActor"/> to continue the chain with</returns>
        public static UserSecurityActor MustBeInRoles(this UserSecurityActor securityActor, params string[] roles)
        {
            foreach (var role in roles) securityActor.AddRule(new RoleRule(securityActor,role));

            return securityActor;
        }
    }
}
