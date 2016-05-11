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
using System.Collections.Generic;
using System.Linq;

namespace Bifrost.Utils
{
    /// <summary>
    /// Represents an implementation of <see cref="IStringMapper"/>
    /// </summary>
    public class StringMapper : IStringMapper
    {
        List<IStringMapping> _mappings = new List<IStringMapping>();

#pragma warning disable 1591 // Xml Comments
        public IEnumerable<IStringMapping> Mappings => _mappings;

        public bool HasMappingFor(string input)
        {
            return Mappings.Any(mapping => mapping.Matches(input));
        }

        public IStringMapping GetFirstMatchingMappingFor(string input)
        {
            return Mappings.FirstOrDefault(mapping => mapping.Matches(input));
        }

        public IEnumerable<IStringMapping> GetAllMatchingMappingsFor(string input)
        {
            return Mappings.Where(mapping => mapping.Matches(input));
        }

        public string Resolve(string input)
        {
            return GetFirstMatchingMappingFor(input)?.Resolve(input);
        }

        public void AddMapping(string format, string mappedFormat)
        {
            _mappings.Add(new StringMapping(format, mappedFormat));
        }

        public void AddMapping(IStringMapping mapping)
        {
            _mappings.Add(mapping);
        }
#pragma warning restore 1591 // Xml Comments
    }
}
