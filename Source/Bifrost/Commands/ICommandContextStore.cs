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

namespace Bifrost.Commands
{
    /// <summary>
    /// Defines the store for getting and saving <see cref="CommandContext">CommandContext</see> from its persistent data store
    /// </summary>
    public interface ICommandContextStore
    {
        /// <summary>
        /// Get a specific <see cref="CommandContext">CommandContext</see> based on its Id
        /// </summary>
        /// <param name="id">The Id of the <see cref="CommandContext">CommandContext</see> to get</param>
        /// <returns>The actual <see cref="CommandContext">CommandContext</see></returns>
        CommandContext Get(Guid id);
    }
}
