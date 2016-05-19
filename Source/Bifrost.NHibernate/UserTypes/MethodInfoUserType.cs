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
using System;
using System.Data;
using System.Reflection;
using Bifrost.Events;
using NHibernate;
using NHibernate.SqlTypes;
using NHibernate.UserTypes;

namespace Bifrost.NHibernate.UserTypes
{
    [Serializable]
    public class MethodInfoUserType : IUserType
    {
        public object Assemble(object cached, object owner) => cached;

        public object Disassemble(object value) => value;

        public object DeepCopy(object value) => value;

        public new bool Equals(object x, object y) => x != null && x.Equals(y);

        public int GetHashCode(object x) => x.GetHashCode();

        public bool IsMutable => false;

        public object NullSafeGet(IDataReader rs, string[] names, object owner)
        {
            var methodInfoString = (string)NHibernateUtil.String.NullSafeGet(rs, names[0]);
            var parts = methodInfoString.Split(';');
            var declaringType = Type.GetType(parts[0]);
            var eventType = Type.GetType(parts[1]);
            var method = declaringType.GetMethod(ProcessMethodInvoker.ProcessMethodName, new[] { eventType });
            return method;
        }

        public void NullSafeSet(IDbCommand cmd, object value, int index)
        {
            var method = (MethodInfo)value;
            var methodString = string.Format(
                "{0};{1}",
                method.DeclaringType.AssemblyQualifiedName,
                method.GetParameters()[0].ParameterType.AssemblyQualifiedName);
            NHibernateUtil.String.NullSafeSet(cmd, methodString, index);
        }

        public object Replace(object original, object target, object owner) => original;

        public Type ReturnedType => typeof(MethodInfo);

        public SqlType[] SqlTypes => new[] { new SqlType(DbType.String) };
    }
}
