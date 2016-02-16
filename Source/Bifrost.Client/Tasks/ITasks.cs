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
using System.Collections.Generic;

namespace Bifrost.Tasks
{
    /// <summary>
    /// Defines a system that coordinates <see cref="ITask">tasks</see>
    /// </summary>
    public interface ITasks
    {
        /// <summary>
        /// Gets wether or not the task system is running tasks - indicating its busy
        /// </summary>
        bool IsBusy { get; }

        /// <summary>
        /// Gets all tasks running in this system
        /// </summary>
        IEnumerable<ITask> All { get; }

        /// <summary>
        /// Gets all the contexts for running tasks in this system
        /// </summary>
        IEnumerable<TaskContext> Contexts { get; }

        /// <summary>
        /// Execute a task
        /// </summary>
        /// <param name="task">Task to execute</param>
        /// <returns><see cref="TaskContext"/> for the task</returns>
        TaskContext Execute(ITask task, object associatedData = null);
    }
}
