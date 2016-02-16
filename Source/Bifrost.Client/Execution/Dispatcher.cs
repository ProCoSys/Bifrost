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

namespace Bifrost.Execution
{

    /// <summary>
    /// Represents a <see cref="IDispatcher"/>
    /// </summary>
    public class Dispatcher : IDispatcher
    {
        System.Windows.Threading.Dispatcher _systemDispatcher;

        /// <summary>
        /// Initializes a new instance of <see cref="Dispatcher"/>
        /// </summary>
        /// <param name="systemDispatcher"></param>
        public Dispatcher(System.Windows.Threading.Dispatcher systemDispatcher)
        {
            _systemDispatcher = systemDispatcher;
        }

#pragma warning disable 1591 // Xml Comments
        public bool CheckAccess()
        {
            return _systemDispatcher.CheckAccess();
        }

        public void BeginInvoke(Delegate del, params object[] arguments)
        {
            _systemDispatcher.BeginInvoke(del, arguments);
        }

        public void BeginInvoke(Action action)
        {
            _systemDispatcher.BeginInvoke(action);
        }
#pragma warning restore 1591 // Xml Comments
    }
}
