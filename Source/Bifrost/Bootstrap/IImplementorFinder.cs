using System;
using System.Collections.Generic;

namespace Bifrost.Bootstrap
{
    /// <summary>
    /// Defines a bootstrapping system to easily find an implementation of a type.
    /// </summary>
    /// <remarks>
    /// A contract is considered an abstract type or an interface.
    /// </remarks>
    public interface IImplementorFinder
    {
        /// <summary>
        /// Retrieve one implementor of a specific contract.
        /// </summary>
        /// <param name="contract"><see cref="Type"/> of contract to retrieve for.</param>
        /// <returns>The single type implementing the contract, or null if no type is found.</returns>
        /// <exception cref="MultipleTypesFoundException">
        /// If multiple implementing types of <paramref name="contract"/> were found.
        /// </exception>
        Type GetImplementorFor(Type contract);

        /// <summary>
        /// Retrieve implementors of a specific contract.
        /// </summary>
        /// <param name="contract"><see cref="Type"/> of contract to retrieve for</param>
        /// <returns><see cref="IEnumerable{T}">Types</see> implementing the contract</returns>
        IEnumerable<Type> GetImplementorsFor(Type contract);
    }
}
