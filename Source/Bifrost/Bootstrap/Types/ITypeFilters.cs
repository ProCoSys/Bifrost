using System;

namespace Bifrost.Bootstrap.Types
{
    /// <summary>
    /// Defines a system for filtering types.
    /// </summary>
    public interface ITypeFilters
    {
        /// <summary>
        /// Method that decides wether or not a type should be included.
        /// </summary>
        /// <param name="type">Type to ask for.</param>
        /// <returns>True if it should be included, false if not.</returns>
        bool ShouldInclude(Type type);
    }
}
