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
using Bifrost.Read;
using NHibernate;
using NHibernate.Linq;

namespace Bifrost.NHibernate.Read
{
    public class ReadModelRepositoryFor<T> : IReadModelRepositoryFor<T> where T:IReadModel
    {
        ISessionFactory _sessionFactory;

        public ReadModelRepositoryFor(ISessionFactory sessionFactory)
        {
            _sessionFactory = sessionFactory;
        }

        ISession Session
        {
            get { return _sessionFactory.GetCurrentSession(); }
        }

        public T GetById(object id)
        {
            return Session.Get<T>(id);
        }

        public IQueryable<T> Query
        {
            get { return Session.Query<T>();  }
        }

        public void Insert(T readModel)
        {
            Session.Save(readModel);
        }

        public void Update(T readModel)
        {
            Session.Update(readModel);
        }

        public void Delete(T readModel)
        {
            Session.Delete(readModel);
        }
    }
}
