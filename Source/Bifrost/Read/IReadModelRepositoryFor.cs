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
using System.Linq;

namespace Bifrost.Read
{
    /// <summary>
    /// Defines a repository for dealing with ReadModels
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface IReadModelRepositoryFor<T> where T:IReadModel
    {
        /// <summary>
        /// Gets a queryable to use for querying
        /// </summary>
        IQueryable<T> Query { get; }

        /// <summary>
        /// Insert a newly created <see cref="IReadModel"/>
        /// </summary>
        /// <param name="readModel"><see cref="IReadModel"/> to insert</param>
        void Insert(T readModel);

        /// <summary>
        /// Update an existing <see cref="IReadModel"/>
        /// </summary>
        /// <param name="readModel"><see cref="IReadModel"/> to update</param>
        void Update(T readModel);

        /// <summary>
        /// Delete an existing <see cref="IReadModel"/>
        /// </summary>
        /// <param name="readModel"><see cref="IReadModel"/> to delete</param>
        void Delete(T readModel);

        /// <summary>
        /// Get a <see cref="IReadModel"/> by its id
        /// </summary>
        /// <param name="id">Id to lookup</param>
        /// <returns></returns>
        T GetById(object id);
    }
}
