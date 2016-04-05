using System;
using Bifrost.Specifications;

namespace Bifrost.Bootstrap.Types
{
    /// <summary>
    /// Defines a configuration for how to include or exclude types.
    /// </summary>
    public interface ITypesConfiguration
    {
        /// <summary>
        /// Gets the specification to use.
        /// </summary>
        Specification<Type> Specification { get; set; }
    }
}
