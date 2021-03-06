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

namespace Bifrost.CodeGeneration.JavaScript
{
    /// <summary>
    /// Represents a scope, typically used when you want to assign something within a scope
    /// </summary>
    public class Scope : LanguageElement
    {
        /// <summary>
        /// Initializes a new instance of a <see cref="Scope"/>
        /// </summary>
        /// <param name="name">Name of scope</param>
        public Scope(string name)
        {
            Name = name;
        }

        /// <summary>
        /// Gets or sets the name of the scope
        /// </summary>
        public string Name { get; set; }


#pragma warning disable 1591
        public override void Write(ICodeWriter writer)
        {
            foreach (var child in Children)
            {
                writer.WriteWithIndentation("{0}.", Name);
                child.Write(writer);
                writer.Write(";");
                writer.Newline();
            }
        }
#pragma warning restore 1591
    }
}
