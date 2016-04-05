using System.Collections.Generic;

namespace Bifrost.Bootstrap.Types
{
    /// <summary>
    /// Defines a system for automatic binding of instances.
    /// </summary>
    public interface IAutoBinder
    {
        /// <summary>
        /// Binds an object instance to all base and implementing types.
        /// </summary>
        /// <param name="instance">The object to bind.</param>
        void Bind(object instance);

        /// <summary>
        /// Binds many object instances to their respective base and implementing types.
        /// </summary>
        /// <param name="instances">The objects to bind.</param>
        void BindAll(IEnumerable<object> instances);
    }
}
