using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Bifrost.Extensions;

namespace Bifrost.Execution
{
    /// <summary>
    /// Represents an implementation of <see cref="IOrderedInstancesOf{T}"/>.
    /// </summary>
    /// <typeparam name="T">Base type to discover for - must be an abstract class or an interface</typeparam>
    public class OrderedInstancesOf<T> : IOrderedInstancesOf<T> where T : class
    {
        readonly IInstancesOf<T> _instances;

        /// <summary>
        /// Initalizes an instance of <see cref="OrderedInstancesOf{T}"/>
        /// </summary>
        /// <param name="instances">The instances to order.</param>
        public OrderedInstancesOf(IInstancesOf<T> instances)
        {
            _instances = instances;
        }

#pragma warning disable 1591 // Xml Comments
        public IEnumerator<T> GetEnumerator()
        {
            IList<T> queue = _instances.OrderBy(Order).ToList();
            ISet<Type> initialized = new HashSet<Type>();

            while (queue.Count > 0)
            {
                var progress = false;
                var ready = queue
                    .Where(s => s
                        .GetType()
                        .GetAttributes<AfterAttribute>()
                        .SelectMany(a => a.DependantTypes)
                        .All(initialized.Contains))
                    .ToList();
                foreach (var instance in ready)
                {
                    yield return instance;
                    initialized.Add(instance.GetType());
                    queue.Remove(instance);
                    progress = true;
                }

                if (!progress)
                {
                    throw new CyclicDependencyException(
                        "Circular dependency between these startup modules detected: " + string.Join(", ", queue));
                }
            }
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
#pragma warning restore 1591 // Xml Comments

        static int Order(T arg)
        {
            return arg.GetType().GetAttributes<OrderAttribute>().Select(a => a.Order).FirstOrDefault();
        }
    }
}
