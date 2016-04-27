using System;
using Bifrost.Specifications;

namespace Bifrost.Bootstrap.Types
{
    /// <summary>
    /// Represents the default <see cref="ITypesConfiguration"/>, which is to exclude no types.
    /// </summary>
    public class ExcludeNone : ITypesConfiguration
    {
        /// <summary>
        /// Initializes an instance of <see cref="ExcludeNone"/>.
        /// </summary>
        public ExcludeNone()
        {
            Specification = new MatchAll<Type>();
        }

        /// <summary>
        /// Gets the current specification.
        /// </summary>
        public Specification<Type> Specification { get; set; }
    }
}
