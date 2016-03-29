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
using System.Collections.Generic;
using System.Linq;
using Bifrost.Execution;
using Ninject;
using Ninject.Parameters;

namespace Bifrost.Ninject
{
    public class Container : IContainer
    {
        readonly List<Type> _boundServices;

        public Container(IKernel kernel)
        {
            Kernel = kernel;
            _boundServices = new List<Type>();
        }

        public virtual BindingLifecycle DefaultLifecycle => BindingLifecycle.Transient;

        public IKernel Kernel { get; }

        public T Get<T>()
        {
            return (T)Get(typeof(T), false);
        }

        public T Get<T>(bool optional)
        {
            return (T)Get(typeof(T), optional);
        }

        public object Get(Type type)
        {
            return Get(type, false);
        }

        public object Get(Type type, bool optional)
        {
            var request = Kernel.CreateRequest(type, null, new IParameter[0], optional, true);
            return Kernel.Resolve(request).SingleOrDefault();
        }

        public IEnumerable<T> GetAll<T>()
        {
            return Kernel.GetAll<T>();
        }

        public bool HasBindingFor(Type type)
        {
            return Kernel.GetBindings(type).Count() != 0;
        }

        public bool HasBindingFor<T>()
        {
            return HasBindingFor(typeof (T));
        }

        public IEnumerable<object> GetAll(Type type)
        {
            return Kernel.GetAll(type);
        }

        public IEnumerable<Type> GetBoundServices()
        {
            return _boundServices;
        }

        public void Bind<T>(Type type)
        {
            Bind<T>(type, DefaultLifecycle);
        }

        public void Bind(Type service, Type type)
        {
            Bind(service, type, DefaultLifecycle);
        }

        public void Bind<T>(Type type, BindingLifecycle lifecycle)
        {
            Kernel.Bind<T>().To(type).WithLifecycle(lifecycle);
            _boundServices.Add(typeof(T));
        }

        public void Bind(Type service, Type type, BindingLifecycle lifecycle)
        {
            Kernel.Bind(service).To(type).WithLifecycle(lifecycle);
            _boundServices.Add(service);
        }

        public void Bind<T>(T instance)
        {
            Kernel.Bind<T>().ToConstant(instance);
            _boundServices.Add(typeof(T));
        }

        public void Bind(Type service, object instance)
        {
            Kernel.Bind(service).ToConstant(instance);
            _boundServices.Add(service);
        }


        public void Bind<T>(Func<T> resolveCallback)
        {
            Bind(resolveCallback, DefaultLifecycle);
        }

        public void Bind(Type service, Func<Type, object> resolveCallback)
        {
            Bind(service, resolveCallback, DefaultLifecycle);
        }

        public void Bind<T>(Func<T> resolveCallback, BindingLifecycle lifecycle)
        {
            Kernel.Bind<T>().ToMethod(c => resolveCallback()).WithLifecycle(lifecycle);
            _boundServices.Add(typeof(T));
        }

        public void Bind(Type service, Func<Type, object> resolveCallback, BindingLifecycle lifecycle)
        {
            Kernel.Bind(service).ToMethod(c => resolveCallback(c.Request.Service)).WithLifecycle(lifecycle);
            _boundServices.Add(service);
        }
    }
}
