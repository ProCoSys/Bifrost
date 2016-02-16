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
using Bifrost.Read;
using NHibernate;
using NHibernate.Criterion;


namespace Bifrost.NHibernate.Read
{
    public class QueryOverProvider : IQueryProviderFor<IQueryOver>
    {
        public QueryProviderResult Execute(IQueryOver query, PagingInfo paging)
        {
            var result = new QueryProviderResult();
            if (paging.Enabled)
            {
                result.TotalItems = (int)query.RootCriteria.SetProjection(Projections.Count("*")).UniqueResult(); // .FutureValue<int>(); //

                query.RootCriteria.SetFirstResult(paging.Size * paging.Number);
                query.RootCriteria.SetMaxResults(paging.Size);

            }
            result.Items = query.RootCriteria.List();

            // For Total Items - idea
            // http://ayende.com/blog/2334/paged-data-count-with-nhibernate-the-really-easy-way


            return result;
        }
    }
}
