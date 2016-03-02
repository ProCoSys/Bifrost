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
using System.Collections.Generic;
using System.Linq;
using Bifrost.Execution;
using StructureMap;
using IContainer = Bifrost.Execution.IContainer;

namespace Bifrost.StructureMap
{
    public class Container : IContainer
    {
        readonly global::StructureMap.IContainer _container;

        public Container(global::StructureMap.IContainer container)
        {
            _container = container;
        }

        public virtual BindingLifecycle DefaultLifecycle => BindingLifecycle.Transient;

        public T Get<T>()
        {
            return _container.GetInstance<T>();
        }

        public T Get<T>(bool optional)
        {
            try
            {
                return _container.GetInstance<T>();
            }
            catch
            {
                if (!optional)
                {
                    throw;
                }
            }

            return default(T);
        }

        public object Get(Type type)
        {
            return _container.GetInstance(type);
        }

        public object Get(Type type, bool optional)
        {
            try
            {
                return _container.GetInstance(type);
            }
            catch
            {
                if (!optional)
                {
                    throw;
                }
            }

            return null;
        }

        public IEnumerable<T> GetAll<T>()
        {
            return _container.GetAllInstances<T>();
        }

        public bool HasBindingFor(Type type)
        {
            return _container.Model.HasImplementationsFor(type);
        }

        public bool HasBindingFor<T>()
        {
            return _container.Model.HasImplementationsFor<T>();
        }

        public IEnumerable<object> GetAll(Type type)
        {
            return _container.GetAllInstances(type).Cast<object>().ToList();
        }

        public IEnumerable<Type> GetBoundServices()
        {
            return _container.Model.PluginTypes.Select(p => p.PluginType);
        }

        public void Bind(Type service, Func<Type> resolveCallback)
        {
            throw new NotImplementedException();
        }

        public void Bind<T>(Func<Type> resolveCallback)
        {
            throw new NotImplementedException();
        }

        public void Bind(Type service, Func<Type> resolveCallback, BindingLifecycle lifecycle)
        {
            throw new NotImplementedException();
        }

        public void Bind<T>(Func<Type> resolveCallback, BindingLifecycle lifecycle)
        {
            throw new NotImplementedException();
        }

        public void Bind<T>(Type type)
        {
            Bind(type, DefaultLifecycle);
        }

        public void Bind(Type service, Type type)
        {
            Bind(service, type, DefaultLifecycle);
        }

        public void Bind<T>(Type type, BindingLifecycle lifecycle)
        {
            _container.Configure(
                c => c.ForRequestedType<T>().CacheBy(GetInstanceScopeFor(lifecycle)).TheDefault.Is.Type(type));
        }

        public void Bind(Type service, Type type, BindingLifecycle lifecycle)
        {
            _container.Configure(
                c => c.ForRequestedType(service).CacheBy(GetInstanceScopeFor(lifecycle)).TheDefaultIsConcreteType(type));
        }

        public void Bind<T>(T instance)
        {
            _container.Configure(c => c.ForRequestedType<T>().Add(instance));
        }

        public void Bind(Type service, object instance)
        {
            _container.Configure(c => c.ForRequestedType(service).Add(instance));
        }


        InstanceScope GetInstanceScopeFor(BindingLifecycle lifecycle)
        {
            switch (lifecycle)
            {
                case BindingLifecycle.Transient:
                    return InstanceScope.Transient;
                case BindingLifecycle.Request:
                    return InstanceScope.PerRequest;
                case BindingLifecycle.Singleton:
                    return InstanceScope.Singleton;
                case BindingLifecycle.Thread:
                    return InstanceScope.ThreadLocal;
            }

            return InstanceScope.Transient;
        }


        public void Bind<T>(Func<T> resolveCallback)
        {
            throw new NotImplementedException();
        }

        public void Bind(Type service, Func<Type, object> resolveCallback)
        {
            throw new NotImplementedException();
        }

        public void Bind<T>(Func<T> resolveCallback, BindingLifecycle lifecycle)
        {
            throw new NotImplementedException();
        }

        public void Bind(Type service, Func<Type, object> resolveCallback, BindingLifecycle lifecycle)
        {
            throw new NotImplementedException();
        }
    }
}
