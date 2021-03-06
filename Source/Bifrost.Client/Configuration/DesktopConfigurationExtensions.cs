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

namespace Bifrost.Configuration
{
    /// <summary>
    /// Extensions for configuring desktop client type
    /// </summary>
    public static class DesktopConfigurationExtensions
    {
        /// <summary>
        /// Configure frontend for the Windows Desktop - WPF
        /// </summary>
        /// <param name="configuration">Configuration to configure</param>
        /// <param name="configureCallback">Callback for the desktop configuration</param>
        /// <returns></returns>
        public static IConfigure Desktop(this IFrontendConfiguration configuration, Action<DesktopConfiguration> configureCallback = null)
        {
            var desktopConfiguration = new DesktopConfiguration();
            configuration.Target = desktopConfiguration;
            if (configureCallback != null) configureCallback(desktopConfiguration);
            return Configure.Instance;
        }
    }
}
