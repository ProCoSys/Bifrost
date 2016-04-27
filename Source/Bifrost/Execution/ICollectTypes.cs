using System;
using System.Collections.Generic;
using Bifrost.Conventions;

namespace Bifrost.Execution
{
    /// <summary>
    /// Defines a collector that subscribes to discovered types.
    /// </summary>
    /// <remarks>
    /// An application can implement any number of these conventions.
    /// Implement this interface to get notified of all discovered types.
    /// Implementations of this type must have a default constructor.
    /// </remarks>
    public interface ICollectTypes : IConvention
    {
        /// <summary>
        /// Method that is called whenever new types are discovered.
        /// </summary>
        /// <param name="types">The newly discovered types</param>
        void Feed(ICollection<Type> types);
    }
}
