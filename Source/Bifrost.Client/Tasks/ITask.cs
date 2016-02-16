﻿#region License
//
// Copyright (c) 2008-2014, Dolittle (http://www.dolittle.com)
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
using Bifrost.Execution;

namespace Bifrost.Tasks
{
    /// <summary>
    /// Defines a task that gets executed
    /// </summary>
    public interface ITask
    {
        /// <summary>
        /// The method that gets called for executing the actual task
        /// </summary>
        /// <param name="context">The <see cref="TaskContext"/> that the task is running in</param>
        /// <returns>A promise that is used to know when the task is done</returns>
        Promise Execute(TaskContext context);
    }
}
