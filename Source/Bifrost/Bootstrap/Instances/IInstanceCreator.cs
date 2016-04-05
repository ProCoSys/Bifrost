using System;
using Bifrost.Execution;

namespace Bifrost.Bootstrap.Instances
{
    /// <summary>
    /// Defines an interface for creating instances of types.
    /// </summary>
    public interface IInstanceCreator
    {
        /// <summary>
        /// Gets whether this creator can create an instance of a given type.
        /// </summary>
        /// <param name="type">The type to check.</param>
        bool CanCreate(Type type);

        /// <summary>
        /// Creates an instance of a type.
        /// </summary>
        /// <param name="type">The type to create.</param>
        /// <returns>An instance or implementation of the type, or null if an instance cannot be created.</returns>
        /// <exception cref="NoTypesFoundException">
        /// If no implementing types of <paramref name="type"/> was found.
        /// </exception>
        /// <exception cref="MultipleTypesFoundException">
        /// If multiple implementing types of <paramref name="type"/> were found.
        /// </exception>
        /// <exception cref="MissingDefaultConstructorException">
        /// If the found type does not have a default constructor.
        /// </exception>
        object Create(Type type);
    }
}
