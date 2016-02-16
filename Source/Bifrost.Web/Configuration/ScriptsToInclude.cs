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

namespace Bifrost.Web.Configuration
{
    public class ScriptsToInclude
    {
        public bool JQuery { get; set; }
        public bool Knockout { get; set; }
        public bool JQueryHistory { get; set; }
        public bool Require { get; set; }
        public bool Bifrost { get; set; }

        public bool SignalR { get; set; }

        public ScriptsToInclude()
        {
            JQuery = true;
            JQueryHistory = true;
            Knockout = true;
            Require = true;
            Bifrost = true;
            SignalR = true;
        }

        public void ExcludeAllScripts()
        {
            JQuery = false;
            JQueryHistory = false;
            Knockout = false;
            Require = false;
            Bifrost = false;
            SignalR = false;
        }
    }
}
