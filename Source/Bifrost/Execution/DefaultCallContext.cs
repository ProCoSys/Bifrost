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
using System.Collections.Generic;

namespace Bifrost.Execution
{
    /// <summary>
    /// Represents a <see cref="ICallContext"/>
    /// </summary>
    public class DefaultCallContext : ICallContext
    {
        [ThreadStatic]
        static Dictionary<string, object> _data = new Dictionary<string, object>();

#pragma warning disable 1591 // Xml Comments
        public bool HasData(string key)
        {
            return _data.ContainsKey(key);
        }

        public T GetData<T>(string key)
        {
            return (T)_data[key];
        }

        public void SetData(string key, object data)
        {
            _data[key] = data;
        }
#pragma warning restore 1591 // Xml Comments
    }
}
