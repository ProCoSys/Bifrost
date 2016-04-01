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
using Bifrost.Conventions;

namespace Bifrost.Commands
{
    /// <summary>
    /// Marker interface for command handlers.
    /// </summary>
    /// <remarks>
    /// A command handler must then implement a Handle method that takes the
    /// specific <see cref="ICommand">command</see> you want to be handled.
    ///
    /// The system will automatically detect your command handlers and methods
    /// and call it automatically when a <see cref="ICommand">command</see>
    /// comes into the system.
    /// </remarks>
    public interface IHandleCommands : IConvention
    {
    }
}
