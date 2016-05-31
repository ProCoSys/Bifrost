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
using Bifrost.Concepts;

namespace Bifrost.Extensions
{
    /// <summary>
    /// Provides a set of extension methods to <see cref="string"/>.
    /// </summary>
    public static class StringExtensions
    {
        /// <summary>
        /// Convert a string into a camel cased string.
        /// </summary>
        /// <param name="str">String to convert.</param>
        /// <returns>Converted string.</returns>
        public static string ToCamelCase(this string str)
        {
            if (!string.IsNullOrEmpty(str))
            {
                if (str.Length == 1)
                    return str.ToLowerInvariant();

                var firstLetter = str[0].ToString().ToLowerInvariant();
                return firstLetter + str.Substring(1);
            }
            return str;
        }

        /// <summary>
        /// Convert a string into a pascal cased string.
        /// </summary>
        /// <param name="str">String to convert.</param>
        /// <returns>Converted string.</returns>
        public static string ToPascalCase(this string str)
        {
            if (!string.IsNullOrEmpty(str))
            {
                if (str.Length == 1)
                    return str.ToUpperInvariant();

                var firstLetter = str[0].ToString().ToUpperInvariant();
                return firstLetter + str.Substring(1);
            }
            return str;
        }

        /// <summary>
        /// Convert a string into the desired type.
        /// </summary>
        /// <param name="input">The string to parse.</param>
        /// <param name="type">The desired type.</param>
        /// <returns>Value as the desired type.</returns>
        public static object ParseTo(this string input, Type type)
        {
            if (type == typeof(Guid)) {
                Guid result;
                if (Guid.TryParse(input, out result)) return result;
                return Guid.Empty;
            }

            if (type.IsConcept())
            {
                var primitiveType = type.GetConceptValueType();
                var primitive = ParseTo(input, primitiveType);
                return ConceptFactory.CreateConceptInstance(type, primitive);
            }

            return Convert.ChangeType(input, type, null);
        }

        /// <summary>
        /// Strips the prefix from the beginning of a string.
        /// </summary>
        /// <param name="input">The string to remove the prefix from.</param>
        /// <param name="prefix">The prefix to remove from the beginning of the input string.</param>
        /// <returns>The input string without the prefix, or the input string itself if it does not have the prefix.</returns>
        public static string RemovePrefix(this string input, string prefix)
        {
            return input.StartsWith(prefix) ? input.Substring(prefix.Length) : input;
        }

        /// <summary>
        /// Strips the postfix from the end of a string.
        /// </summary>
        /// <param name="input">The string to remove the postfix from.</param>
        /// <param name="postfix">The postfix to remove from the end of the input string.</param>
        /// <returns>The input string without the postfix, or the input string itself if it does not have the postfix.</returns>
        public static string RemovePostfix(this string input, string postfix)
        {
            return input.EndsWith(postfix) ? input.Substring(0, input.Length - postfix.Length) : input;
        }
    }
}
