using System;
using System.Collections.Generic;
using Bifrost.Execution;

namespace Bifrost.Bootstrap.Types
{
    /// <summary>
    /// Defines a type collector used in bootstrapping. It can also be used to retrieve types after initialization.
    /// </summary>
    public interface ITypeCollector : IBootstrapContainer
    {
        /// <summary>
        /// Feeds the discovered types to this collector.
        /// </summary>
        /// <param name="types">The types to feed.</param>
        void Feed(ICollection<Type> types);

        /// <summary>
        /// Gets the list of discovered types so far.
        /// </summary>
        IEnumerable<Type> Types { get; }

        /// <summary>
        /// Finds a single type using the full name.
        /// </summary>
        /// <param name="fullName">Full name of the type to find.</param>
        /// <returns>The type if it is found, null otherwise.</returns>
        /// <exception cref="MultipleTypesFoundException">If multiple types of the same full name is discovered.</exception>
        Type ByFullName(string fullName);
    }
}
