using Bifrost.Bootstrap.Assemblies;
using Bifrost.Specifications;

namespace Bifrost.Configuration.Assemblies
{
    /// <summary>
    /// Provides extensions for <see cref="IAssembliesConfiguration"/>.
    /// </summary>
    public static class AssemblyConfigurationExtensions
    {
        /// <summary>
        /// Includes specified assemblies.
        /// </summary>
        /// <param name="assemblyConfiguration"><see cref="IAssembliesConfiguration"/> to build upon.</param>
        /// <param name="names">Names that assemblies should be starting with.</param>
        /// <returns>Chained <see cref="IAssembliesConfiguration"/>.</returns>
        public static IAssembliesConfiguration IncludeAssembliesStartingWith(
            this IAssembliesConfiguration assemblyConfiguration, params string[] names)
        {
            assemblyConfiguration.Specification = assemblyConfiguration.Specification.Or(new AssembliesStartingWith(names));
            return assemblyConfiguration;
        }
    }
}