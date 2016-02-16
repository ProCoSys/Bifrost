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

using System.Threading;
using Bifrost.Configuration;

namespace Bifrost.Globalization
{
    /// <summary>
    /// Represents a <see cref="ILocalizer"/>
    /// </summary>
    public class Localizer : ILocalizer
    {
#pragma warning disable 1591 // Xml Comments
        public LocalizationScope BeginScope()
        {
            var scope = LocalizationScope.FromCurrentThread();

            Thread.CurrentThread.CurrentCulture = Configure.Instance.Culture;
            Thread.CurrentThread.CurrentUICulture = Configure.Instance.UICulture;

            return scope;
        }

        public void EndScope(LocalizationScope scope)
        {
            Thread.CurrentThread.CurrentCulture = scope.Culture;
            Thread.CurrentThread.CurrentUICulture = scope.UICulture;
        }
#pragma warning restore 1591 // Xml Comments
    }
}