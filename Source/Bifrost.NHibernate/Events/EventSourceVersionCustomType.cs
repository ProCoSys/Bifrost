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
using System.Data;
using Bifrost.Events;
using NHibernate;
using NHibernate.SqlTypes;
using NHibernate.UserTypes;

namespace Bifrost.NHibernate.Events
{
    [Serializable]
    public class EventSourceVersionCustomType : IUserType
    {
        public object Assemble(object cached, object owner) => cached;

        public object Disassemble(object value) => value;

        public object DeepCopy(object value) => value;

        public new bool Equals(object x, object y) => x != null && x.Equals(y);

        public int GetHashCode(object x) => x.GetHashCode();

        public bool IsMutable => false;

        public object NullSafeGet(IDataReader rs, string[] names, object owner)
        {
            var versionAsDouble = (double)NHibernateUtil.Double.NullSafeGet(rs, names[0]);
            var version = EventSourceVersion.FromCombined(versionAsDouble);
            return version;
        }

        public void NullSafeSet(IDbCommand cmd, object value, int index)
        {
            var version = (EventSourceVersion)value;
            var versionAsDouble = version.Combine();
            NHibernateUtil.Double.NullSafeSet(cmd, versionAsDouble, index);
        }

        public object Replace(object original, object target, object owner) => original;

        public Type ReturnedType => typeof(EventSourceVersion);

        public SqlType[] SqlTypes => new[] { new SqlType(DbType.Double) };
    }
}
