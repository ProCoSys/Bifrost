using System.Collections.Generic;
using Bifrost.Bootstrap.Assemblies;
using Bifrost.Bootstrap.Types;
using Bifrost.Configuration.Assemblies;
using Bifrost.Execution;

namespace Bifrost.Bootstrap.Defaults
{
    /// <summary>
    /// Represents a default implementation of <see cref="IBootstrapConfiguration"/>.
    /// </summary>
    public class DefaultBootstrapConfiguration : IBootstrapConfiguration
    {
        /// <summary>
        /// Gets or sets the collection of <see cref="ICanProvideAssemblies"/> used in bootstrapping.
        /// </summary>
        /// <remarks>
        /// By default, assemblies are loaded from the app domain and from the current folder of the file system.
        /// </remarks>
        public IEnumerable<ICanProvideAssemblies> AssemblyProviders { get; set; } =
            new ICanProvideAssemblies[]
            {
                new AppDomainAssemblyProvider(),
                new FileSystemAssemblyProvider(new FileSystem(), new AssemblyUtility()),
            };

        /// <summary>
        /// Gets or sets the <see cref="IAssembliesConfiguration"/> for how to include or exclude assemblies.
        /// </summary>
        /// <remarks>By default, no assemblies are included.</remarks>
        public IAssembliesConfiguration AssembliesConfiguration { get; set; } = new IncludeNone();

        /// <summary>
        /// Gets or sets the <see cref="ITypesConfiguration"/> for how to include or exclude assemblies.
        /// </summary>
        /// <remarks>By default, all types are included.</remarks>
        public ITypesConfiguration TypesConfiguration { get; set; } = new ExcludeNone();
    }
}
