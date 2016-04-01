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

namespace Bifrost.Configuration
{
    /// <summary>
    /// Represents an interface for a system that gets invoked when configuration has been done.
    /// </summary>
    /// <remarks>
    /// An application can implement any number of these conventions.
    /// They will be called after the <see cref="IConfigure"/> object is finished configuring.
    /// </remarks>
    public interface IWantToKnowWhenConfigurationIsDone : IConvention
    {
        /// <summary>
        /// Method that gets called when <see cref="IConfigure"/> is completed.
        /// </summary>
        /// <param name="configure"><see cref="IConfigure"/> object that was configured.</param>
        void Configured(IConfigure configure);
    }
}
