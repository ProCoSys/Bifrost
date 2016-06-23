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
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using Bifrost.Extensions;
using Bifrost.Serialization;

namespace Bifrost.Web.Services
{
    /// <summary>
    /// Represents an instance of <see cref="IRequestParamsFactory"/>
    /// </summary>
    public class RequestParamsFactory : IRequestParamsFactory
    {
        readonly ISerializer _serializer;

        public RequestParamsFactory(ISerializer serializer)
        {
            _serializer = serializer;
        }

#pragma warning disable 1591 // Xml Comments
        public IDictionary<string, string> BuildParamsCollectionFrom(HttpRequestBase request)
        {
            // If there are duplicate keys, select from the first available dictionary.
            return new[]
            {
                request.QueryString.ToDictionary(),
                request.Form.ToDictionary(),
                BuildFormFromInputStream(request.InputStream),
            }
                .SelectMany(d => d)
                .ToLookup(kv => kv.Key)
                .ToDictionary(kv => kv.Key, kv => kv.First().Value);
        }
#pragma warning restore 1591 // Xml Comments

        IDictionary<string, string> BuildFormFromInputStream(Stream stream)
        {
            using (var reader = new StreamReader(stream, Encoding.UTF8))
            {
                var inputAsString = reader.ReadToEnd();
                return _serializer.FromJson<Dictionary<string, string>>(inputAsString) ?? new Dictionary<string, string>();
            }
        }
    }
}
