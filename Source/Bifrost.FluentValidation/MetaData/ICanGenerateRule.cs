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
using FluentValidation.Validators;
using System;
using Bifrost.Validation.MetaData;

namespace Bifrost.FluentValidation.MetaData
{
    /// <summary>
    /// Defines a system that can generate rule from a Fluent Validations property validator
    /// </summary>
    public interface ICanGenerateRule
    {
        /// <summary>
        /// Types that are supported by the generator
        /// </summary>
        Type[] From { get; }

        /// <summary>
        /// Generate from a specific <see cref="IPropertyValidator"/>
        /// </summary>
        /// <param name="propertyName">Name of the property</param>
        /// <param name="propertyValidator"><see cref="IPropertyValidator"/></param>
        /// <returns></returns>
        Rule GeneratorFrom(string propertyName, IPropertyValidator propertyValidator);
    }
}
