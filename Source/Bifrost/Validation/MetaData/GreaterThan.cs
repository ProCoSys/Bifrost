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
namespace Bifrost.Validation.MetaData
{
    /// <summary>
    /// Represents the metadata for the GreaterThan validation rule
    /// </summary>
    public class GreaterThan : Rule
    {
        /// <summary>
        /// Gets or sets the value that values validated up against must be greater than
        /// </summary>
        public object Value { get; set; }
    }
}
