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

namespace Bifrost.Events
{
    /// <summary>
    /// Represents a <see cref="IUncommittedEventStreamCoordinator"/>
    /// </summary>
    public class UncommittedEventStreamCoordinator : IUncommittedEventStreamCoordinator
    {
        IEventStore _eventStore;
        IEventStoreChangeManager _eventStoreChangeManager;
        IEventSubscriptionManager _eventSubscriptionManager;


        /// <summary>
        /// Initializes an instance of a <see cref="UncommittedEventStreamCoordinator"/>
        /// </summary>
        /// <param name="eventStore"><see cref="IEventStore"/> to use for saving the events</param>
        /// <param name="eventStoreChangeManager"><see cref="IEventStoreChangeManager"/> to notify about changes</param>
        /// <param name="eventSubscriptionManager"><see cref="IEventSubscriptionManager"/> to process subscriptions</param>
        public UncommittedEventStreamCoordinator(
            IEventStore eventStore,
            IEventStoreChangeManager eventStoreChangeManager,
            IEventSubscriptionManager eventSubscriptionManager)
        {
            _eventStore = eventStore;
            _eventStoreChangeManager = eventStoreChangeManager;
            _eventSubscriptionManager = eventSubscriptionManager;
        }


#pragma warning disable 1591 // Xml Comments
        public void Commit(UncommittedEventStream uncommittedEventStream)
        {
            var committedEventStream = _eventStore.Commit(uncommittedEventStream);
            _eventSubscriptionManager.Process(committedEventStream);
            _eventStoreChangeManager.NotifyChanges(_eventStore, committedEventStream);
        }
#pragma warning restore 1591 // Xml Comments
    }
}
