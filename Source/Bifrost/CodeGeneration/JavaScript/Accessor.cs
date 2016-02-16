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

namespace Bifrost.CodeGeneration.JavaScript
{
    /// <summary>
    /// Represents an accessor
    /// </summary>
    public class Accessor : LanguageElement
    {
        /// <summary>
        /// Initializes a new instance of <see cref="Accessor"/>
        /// </summary>
        /// <param name="name">Name of accessor</param>
        public Accessor(string name)
        {
            Name = name;
        }

        /// <summary>
        /// Gets the name of the <see cref="Accessor"/>
        /// </summary>
        public string Name { get; private set; }

        /// <summary>
        /// Gets or sets any child of the <see cref="Accessor"/>
        /// </summary>
        public ILanguageElement Child { get; set; }

#pragma warning disable 1591
        public override void Write(ICodeWriter writer)
        {
            writer.WriteWithIndentation("{0}", Name);
            if (Child != null)
            {
                writer.Write(".");
                Child.Write(writer);
            }

            writer.Newline();
        }
#pragma warning restore 1591
    }
}
