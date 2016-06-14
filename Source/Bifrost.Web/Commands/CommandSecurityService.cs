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
using Bifrost.Commands;
using Bifrost.Execution;
using Bifrost.Security;
using Bifrost.Web.Services;

namespace Bifrost.Web.Commands
{
    public class CommandSecurityService : IBifrostService
    {
        readonly ICommandSecurityManager _commandSecurityManager;
        readonly ITypeDiscoverer _typeDiscoverer;

        public CommandSecurityService(ICommandSecurityManager commandSecurityManager, ITypeDiscoverer typeDiscoverer)
        {
            _typeDiscoverer = typeDiscoverer;
            _commandSecurityManager = commandSecurityManager;
        }

        public AuthorizationResult GetForCommand(string commandName)
        {
            var commandType = _typeDiscoverer.GetCommandTypeByName(commandName);
            var commandInstance = Activator.CreateInstance(commandType) as ICommand;
            var result = _commandSecurityManager.Authorize(commandInstance);
            return result;
        }
    }
}
