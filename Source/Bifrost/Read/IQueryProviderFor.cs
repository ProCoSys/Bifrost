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
using Bifrost.Conventions;

namespace Bifrost.Read
{
    /// <summary>
    /// Defines a provider that can deal with a query for <typeparamref name="T"/>.
    /// </summary>
    /// <remarks>
    /// Types inheriting from this interface will be automatically registered and called whenever a <see cref="IQuery"/>
    /// with a Query property of type <typeparamref name="T"/> is encountered.
    /// </remarks>
    public interface IQueryProviderFor<T> : IConvention
    {
        /// <summary>
        /// Execute a query
        /// </summary>
        /// <param name="query">Query to execute</param>
        /// <param name="paging"><see cref="PagingInfo"/> to apply</param>
        /// <returns><see cref="QueryResult">Result</see> from the query</returns>
        QueryProviderResult Execute(T query, PagingInfo paging);
    }
}
