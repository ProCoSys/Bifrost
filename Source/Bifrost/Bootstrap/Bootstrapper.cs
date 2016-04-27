using Bifrost.Bootstrap.Assemblies;
using Bifrost.Bootstrap.Types;
using Bifrost.Execution;

namespace Bifrost.Bootstrap
{
    /// <summary>
    /// Defines a Bifrost <see cref="Bootstrapper"/>.
    /// This class can be used to bootstrap the application by discovering types.
    /// </summary>
    public class Bootstrapper
    {
        /// <summary>
        /// Bootstraps the application by discovering types. It will discover types using the given configuration
        /// and feed the types to all discovered implementations of <see cref="ICollectTypes"/>.
        /// </summary>
        /// <param name="bootstrapConfiguration">The bootstrap configuration to use.</param>
        /// <returns>An <see cref="IBootstrapContainer"/> which can be used to create simple types
        /// and finally initialize the real container.</returns>
        public IBootstrapContainer BootstrapTypes(IBootstrapConfiguration bootstrapConfiguration)
        {
            var assembliesConfiguration = new IncludeNone();
            var assemblySpecifiers = new AssemblySpecifiers(assembliesConfiguration);
            var typeCollector = new TypeCollector();

            var assemblyProvider = new AssemblyProvider(
                bootstrapConfiguration.AssemblyProviders,
                assemblySpecifiers,
                new AssemblyFilters(assembliesConfiguration),
                new TypeFilters(bootstrapConfiguration.TypesConfiguration),
                typeCollector);

            typeCollector.RegisterForAutoBind(assemblyProvider);
            return typeCollector;
        }
    }
}
