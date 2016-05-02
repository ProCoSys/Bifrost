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
using System.Web.Mvc;
using System.Web.Mvc.Html;
using Bifrost.Commands;

namespace Bifrost.Web.Mvc.Commands
{
    /// <summary>
    /// Represents a <see cref="MvcForm"/> specific for Commands
    /// </summary>
    /// <typeparam name="T">Type of command the form is for</typeparam>
    public class CommandForm<T> : MvcForm
        where T : ICommand, new()
    {

        /// <summary>
        /// Initializes a new instance of <see cref="CommandForm{T}"/>
        /// </summary>
        /// <param name="viewContext"><see cref="ViewContext"/> the <see cref="CommandForm{T}"/> should be in</param>
        public CommandForm(ViewContext viewContext)
            : base(viewContext)
        {
            var viewDataContainer = new CommandViewDataContainer(viewContext);

            Command = new T();
            viewDataContainer.ViewData.Model = Command;

            Html = new HtmlHelper<T>(viewContext, viewDataContainer);
        }

        /// <summary>
        /// Gets the Html helper for the form
        /// </summary>
        public HtmlHelper<T> Html { get; private set; }

        /// <summary>
        /// Gets the Command for the form
        /// </summary>
        public T Command { get; private set; }

        /// <summary>
        /// Gets or sets the Action for the <see cref="CommandForm"/>
        /// </summary>
        public string Action { get; set; }

        /// <summary>
        /// Gets or sets the controller for the <see cref="CommandForm"/>
        /// </summary>
        public string Controller { get; set; }

    }
}