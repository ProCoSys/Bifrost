using System;
using Bifrost.Execution;
using Bifrost.Extensions;

namespace Bifrost.Bootstrap.Instances
{
    /// <summary>
    /// Implementation of an <see cref="IInstanceCreator"/> which creates instances using
    /// the default constructor of the given concrete type.
    /// </summary>
    /// <remarks>
    /// Can only create instances of concrete types.
    /// </remarks>
    internal class DefaultInstanceCreator : IInstanceCreator
    {
        /// <summary>
        /// Gets whether this creator can create an instance of a given type.
        /// </summary>
        /// <param name="type">The type to check.</param>
        public bool CanCreate(Type type)
        {
            // Lie, since this is a fallback creator that should eventually lead to an exception.
            return true;
        }

        /// <summary>
        /// Creates an instance of the given type using the default constructor.
        /// </summary>
        /// <param name="type">The type to create.</param>
        /// <returns>An instance of the type.</returns>
        /// <exception cref="NoTypesFoundException">
        /// If no implementing types of <paramref name="type"/> was found.
        /// </exception>
        /// <exception cref="MissingDefaultConstructorException">
        /// If the found type does not have a default constructor.
        /// </exception>
        public object Create(Type type)
        {
            if (!type.IsImplementation())
            {
                throw new NoTypesFoundException(type);
            }

            if (!type.HasDefaultConstructor())
            {
                throw new MissingDefaultConstructorException(type);
            }

            return Activator.CreateInstance(type);
        }
    }
}
