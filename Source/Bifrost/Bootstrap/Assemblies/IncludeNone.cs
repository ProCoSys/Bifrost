using Bifrost.Configuration.Assemblies;
using Bifrost.Specifications;

namespace Bifrost.Bootstrap.Assemblies
{
    /// <summary>
    /// Represents the default <see cref="IAssembliesConfiguration"/>, which is to include no assemblies.
    /// </summary>
    public class IncludeNone : IAssembliesConfiguration
    {
        /// <summary>
        /// Initializes an instance of <see cref="IncludeNone"/>.
        /// </summary>
        public IncludeNone()
        {
            Specification = new MatchNone<string>();
        }

        /// <summary>
        /// Gets the current specification.
        /// </summary>
        public Specification<string> Specification { get; set; }
    }
}
