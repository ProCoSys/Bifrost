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
using Bifrost.Execution;

namespace Bifrost.Configuration
{
    /// <summary>
    /// Defines an interface that is used to create a container instance.
    /// </summary>
    /// <remarks>
    /// An application must implement this convention exactly once.
    /// Implementations of this type must have a default constructor.
    /// </remarks>
    public interface ICanCreateContainer : IConvention
    {
        /// <summary>
        /// Creates an instance of the container that will be used throughout the application.
        /// </summary>
        /// <returns>An instance of a <see cref="IContainer"/> implementation.</returns>
        IContainer CreateContainer();
    }
}
