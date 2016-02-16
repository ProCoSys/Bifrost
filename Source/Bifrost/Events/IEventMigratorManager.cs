#region License
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

namespace Bifrost.Events
{
    /// <summary>
    /// Defines the functionality for a manager that handles the migration of events from older generations to newer generations.
    ///
    /// Migrates an <see cref="IEvent">Event</see> to the current generation
    /// </summary>
    public interface IEventMigratorManager
    {
        /// <summary>
        /// Migrates an event from the particular generation to the current generation of the event
        /// </summary>
        /// <param name="source">A previous generation of the event</param>
        /// <returns>The current generation of the event</returns>
        IEvent Migrate(IEvent source);
    }
}