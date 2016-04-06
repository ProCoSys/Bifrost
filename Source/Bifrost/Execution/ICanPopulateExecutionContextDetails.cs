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
using Bifrost.Conventions;

namespace Bifrost.Execution
{
    /// <summary>
    /// Defines a visitor that takes part in populating all the details for the <see cref="IExecutionContext"/>.
    /// </summary>
    /// <remarks>
    /// Types inheriting from this interface will be automatically registered.
    /// An application can implement any number of these conventions.
    /// </remarks>
    public interface ICanPopulateExecutionContextDetails : IConvention
    {
        /// <summary>
        /// Method that gets called when the <see cref="IExecutionContext"/> is being set up.
        /// </summary>
        /// <param name="executionContext"><see cref="IExecutionContext"/> that is populated.</param>
        /// <param name="details">Details for the <see cref="IExecutionContext"/> to populate.</param>
        void Populate(IExecutionContext executionContext, dynamic details);
    }
}
