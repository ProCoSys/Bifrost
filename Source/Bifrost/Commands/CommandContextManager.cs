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
using System;
using Bifrost.Sagas;

namespace Bifrost.Commands
{
    /// <summary>
    /// Represents a <see cref="ICommandContextManager">Command context manager</see>
    /// </summary>
    public class CommandContextManager : ICommandContextManager
    {
        readonly ICommandContextFactory _factory;

        [ThreadStatic] static ICommandContext _currentContext;

        /// <summary>
        /// Reset context
        /// </summary>
        public static void ResetContext()
        {
            _currentContext = null;
        }

        /// <summary>
        /// Initializes a new instance of <see cref="CommandContextManager">CommandContextManager</see>
        /// </summary>
        /// <param name="factory">A <see cref="ICommandContextFactory"/> to use for building an <see cref="ICommandContext"/></param>
        public CommandContextManager(ICommandContextFactory factory)
        {
            _factory = factory;
        }

        private static bool IsInContext(ICommand command)
        {
            var inContext = null != _currentContext && _currentContext.Command.Equals(command);
            return inContext;
        }

#pragma warning disable 1591 // Xml Comments
        public bool HasCurrent
        {
            get { return _currentContext != null; }
        }

        public ICommandContext GetCurrent()
        {
            if (!HasCurrent)
            {
                throw new InvalidOperationException(ExceptionStrings.CommandNotEstablished);
            }
            return _currentContext;
        }

        public ICommandContext EstablishForCommand(ICommand command)
        {
            if (!IsInContext(command))
            {
                var commandContext = _factory.Build(command);
                _currentContext = commandContext;
            }
            return _currentContext;
        }

        public ICommandContext EstablishForSaga(ISaga saga, ICommand command)
        {
            if (!IsInContext(command))
            {
                var commandContext = _factory.Build(saga,command);

                _currentContext = commandContext;
            }
            return _currentContext;
        }
#pragma warning restore 1591 // Xml Comments
    }
}