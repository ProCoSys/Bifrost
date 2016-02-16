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
using System.Reflection;
using Bifrost.Rules;

namespace Bifrost.Validation.Rules
{
    /// <summary>
    /// Represents the <see cref="ValueRule"/> for greater than or equal - any value must be greater than or equal to a given value
    /// </summary>
    public class GreaterThanOrEqual<T> : ValueRule
        where T : IComparable<T>
    {
        /// <summary>
        /// Initializes a new instance of <see cref="GreaterThanOrEqual"/>
        /// </summary>
        /// <param name="property"><see cref="PropertyInfo">Property</see> the rule is for</param>
        /// <param name="value">Value that the input value must be greater than or equal</param>
        public GreaterThanOrEqual(PropertyInfo property, T value) : base(property)
        {
            Value = value;
        }

        /// <summary>
        /// Gets the value that input value must be greater than or equal
        /// </summary>
        public T Value { get; private set; }

#pragma warning disable 1591 // Xml Comments
        public override void Evaluate(IRuleContext context, object instance)
        {
            if (FailIfValueTypeMismatch<T>(context, instance))
            {
                var comparison = ((IComparable<T>)instance).CompareTo(Value);
                if (comparison < 0) context.Fail(this, instance, Reasons.ValueIsLessThan);
            }
        }
#pragma warning restore 1591 // Xml Comments
    }
}
