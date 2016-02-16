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
using System.Linq;
using System.Linq.Expressions;

namespace Bifrost.Read
{
    /// <summary>
    /// Represents an implementation of <see cref="IReadModel{T}"/> for dealing with fetching of single <see cref="IReadModel"/> instances
    /// </summary>
    /// <typeparam name="T">Type of <see cref="IReadModel"/></typeparam>
    public class ReadModelOf<T> : IReadModelOf<T> where T:IReadModel
    {
        IReadModelRepositoryFor<T> _repository;

        /// <summary>
        /// Initializes an instance of <see cref="ReadModelOf{T}"/>
        /// </summary>
        /// <param name="repository">Repository to use getting instances</param>
        public ReadModelOf(IReadModelRepositoryFor<T> repository)
        {
            _repository = repository;
        }


#pragma warning disable 1591 // Xml Comments
        public T InstanceMatching(params Expression<Func<T, bool>>[] propertyExpressions)
        {
            var query = _repository.Query;

            foreach( var expression in propertyExpressions )
                query = query.Where(expression);

            return query.SingleOrDefault();
        }
#pragma warning restore 1591 // Xml Comments
    }
}
