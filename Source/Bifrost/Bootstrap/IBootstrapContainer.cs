using Bifrost.Conventions;
using Bifrost.Execution;

namespace Bifrost.Bootstrap
{
    /// <summary>
    /// Defines a bootstrap container capable of creating types before the real container is ready.
    /// </summary>
    /// <remarks>
    /// Is in the beginning only capable of creating concrete implementations with default constructors.
    /// Once an <see cref="IImplementorFinder"/> is discovered, it will be used to discover implementations.
    /// </remarks>
    public interface IBootstrapContainer
    {
        /// <summary>
        /// Gets an instance of a specific type.
        /// </summary>
        /// <typeparam name="T">Type to get instance of.</typeparam>
        /// <returns>Instance of the type.</returns>
        T Get<T>();

        /// <summary>
        /// Creates the real container by finding and instantiating an implementation of <see cref="ICanCreateContainer"/>.
        /// </summary>
        /// <returns>The real container, with the vital contracts already bound.</returns>
        IContainer BootstrapContainer();
    }
}
