using System.Collections.Generic;
using Bifrost.Bootstrap.Assemblies;
using Bifrost.Bootstrap.Types;
using Bifrost.Configuration.Assemblies;

namespace Bifrost.Bootstrap
{
    /// <summary>
    /// Defines parameters for a bootstrap configuration used in <see cref="Bootstrapper"/>.
    /// </summary>
    public interface IBootstrapConfiguration
    {
        /// <summary>
        /// Gets the collection of <see cref="ICanProvideAssemblies"/> used in bootstrapping.
        /// </summary>
        IEnumerable<ICanProvideAssemblies> AssemblyProviders { get; }

        /// <summary>
        /// Gets the <see cref="IAssembliesConfiguration"/> for how to include or exclude assemblies.
        /// </summary>
        IAssembliesConfiguration AssembliesConfiguration { get; }

        /// <summary>
        /// Gets the <see cref="ITypesConfiguration"/> for how to include or exclude assemblies.
        /// </summary>
        ITypesConfiguration TypesConfiguration { get; }
    }
}
