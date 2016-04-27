using System;

namespace Bifrost.Bootstrap.Types
{
    /// <summary>
    /// Represents an implementation of <see cref="ITypeFilters"/>.
    /// </summary>
    public class TypeFilters : ITypeFilters
    {
        readonly ITypesConfiguration _typesConfiguration;

        /// <summary>
        /// Initializes an instance of <see cref="TypeFilters"/>.
        /// </summary>
        /// <param name="typesConfiguration"></param>
        public TypeFilters(ITypesConfiguration typesConfiguration)
        {
            _typesConfiguration = typesConfiguration;
        }

#pragma warning disable 1591 // Xml Comments
        public bool ShouldInclude(Type type) => _typesConfiguration.Specification.IsSatisfiedBy(type);
#pragma warning restore 1591 // Xml Comments
    }
}
