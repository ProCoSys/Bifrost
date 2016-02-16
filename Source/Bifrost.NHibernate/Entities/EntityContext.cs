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
using Bifrost.Entities;
using NHibernate;
using global::NHibernate.Linq;


namespace Bifrost.NHibernate.Entities
{
    public class EntityContext<T> : IEntityContext<T>
    {
        ISession _session;

        public EntityContext(IConnection connection)
        {
            _session = connection.SessionFactory.OpenSession();
        }

        public IQueryable<T> Entities
        {
            get
            {
                var queryable = _session.Query<T>();
                return queryable;
            }
        }

        public void Attach(T entity)
        {
            _session.SaveOrUpdate(entity);
        }

        public void Insert(T entity)
        {
            _session.Save(entity);
        }

        public void Update(T entity)
        {
            _session.Update(entity);
        }

        public void Delete(T entity)
        {
            _session.Delete(entity);
        }

        public void Save(T entity)
        {
            _session.Save(entity);
        }

        public void Commit()
        {
            _session.Flush();
        }

        public void Dispose()
        {
            _session.Flush();
            _session.Close();
            _session = null;
        }


        public T GetById<TProperty>(TProperty id)
        {
            return _session.Get<T>(id);
        }


        public void DeleteById<TProperty>(TProperty id)
        {
            var entity = _session.Get<T>(id);
            _session.Delete(entity);
        }
    }
}
