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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Bifrost.Web
{
    public class HttpModule : IHttpModule
    {
        static readonly List<IPipe> Pipeline = new List<IPipe>();

        public static void AddPipe(IPipe pipe)
        {
            if (Pipeline.Any(existingPipe => existingPipe.GetType() == pipe.GetType()))
            {
                return;
            }

            Pipeline.Add(pipe);
        }

        public void Init(HttpApplication context)
        {
            context.AuthorizeRequest += AuthorizeRequest;
        }

        static void AuthorizeRequest(object sender, EventArgs e)
        {
            var context = new WebContext(HttpContext.Current);
            foreach (var pipe in Pipeline)
            {
                pipe.Before(context);
            }
        }

        public void Dispose()
        {
        }
    }
}
